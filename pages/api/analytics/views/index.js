import axios from 'axios';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const getMockData = () => {
  const mockData = [];
  const today = new Date();
  
  // 生成过去7天的模拟数据
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    mockData.push({
      t: formatDate(date.toISOString()),
      visits: 0
    });
  }
  return mockData;
};

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { handle, filter } = req.query;

    if (!handle || typeof handle !== 'string') {
      return res.status(404).end();
    }

    // 检查缓存
    const cacheKey = `${handle}-${filter}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      const { data, timestamp } = cachedData;
      if (Date.now() - timestamp < CACHE_DURATION) {
        return res.status(200).json(data);
      }
      cache.delete(cacheKey);
    }

    // 如果没有配置 Tinybird token，返回模拟数据
    if (!process.env.ANALYTICS_TOKEN) {
      const mockData = getMockData();
      cache.set(cacheKey, { data: mockData, timestamp: Date.now() });
      return res.status(200).json(mockData);
    }

    const endpoint = 'https://api.tinybird.co/v0/pipes/libre_page_views.json';

    try {
      const analytics = await axios.get(
        `${endpoint}?token=${process.env.ANALYTICS_TOKEN}&filter=${filter}&handle=/${handle}`
      );

      let analytics_formatted;

      if (filter !== 'last_24_hours' && filter !== 'last_hour') {
        analytics_formatted = analytics.data.data.map(({ t, visits }) => ({
          t: formatDate(t),
          visits,
        }));
      } else {
        analytics_formatted = analytics.data.data.map(({ t, visits }) => ({
          t: formatTime(t),
          visits,
        }));
      }

      // 存入缓存
      cache.set(cacheKey, { 
        data: analytics_formatted, 
        timestamp: Date.now() 
      });

      return res.status(200).json(analytics_formatted);
    } catch (error) {
      // Tinybird API 调用失败时返回模拟数据
      return res.status(200).json(getMockData());
    }
  } catch (error) {
    // 其他错误时也返回模拟数据
    return res.status(200).json(getMockData());
  }
}

//   if (req.method !== "POST" && req.method !== "GET") {
//     return res.status(405).end();
//   }

//   try {
//     const { id } = req.query;

//     if (!id || typeof id !== "string") {
//       return res.status(404).end();
//       //   throw new Error("Invalid ID");
//     }

//     if (req.method == "GET") {
//       const { filterOption, id } = req.query;
//       const viewsData = await getPageViewsByDuration(id, filterOption);

//       return res.status(200).json(viewsData);
//     } else if (req.method == "POST") {
//       await db.pageView.create({
//         data: {
//           userId: id,
//           timestamp: new Date(),
//         },
//       });

//       return res.status(200).json({ msg: "Visit tracked" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(400).end();
//   }
// }

// async function getPageViewsByDuration(userId, period) {
//   const currentDate = new Date();
//   const startDate = new Date();

//   if (period === "1hr") {
//     startDate.setHours(currentDate.getHours() - 1);
//   } else if (period === "7d") {
//     startDate.setDate(currentDate.getDate() - 7);
//   } else if (period === "30d") {
//     startDate.setMonth(currentDate.getMonth() - 1);
//   }

//   const pageViews = await db.pageView.findMany({
//     where: {
//       userId: userId,
//       timestamp: {
//         gte: startDate,
//         lt: currentDate,
//       },
//     },
//     orderBy: {
//       timestamp: "asc",
//     },
//   });

//   return transformDataForBarGraph(pageViews, period);
// }

// function transformDataForBarGraph(pageViews, period) {
//   const data = [];

//   const aggregation = {
//     "1hr": {
//       // Aggregate by hour
//       format: "yyyy-MM-dd HH:00",
//       step: 60 * 60 * 1000, // 1 hour in milliseconds
//       previousCount: 2,
//       nextCount: 2,
//     },
//     "7d": {
//       // Aggregate by day
//       format: "yyyy-MM-dd",
//       step: 24 * 60 * 60 * 1000, // 1 day in milliseconds
//       previousCount: 6, // 6 previous days to make it total 7 days
//       nextCount: 0, // No next days as it covers the range till today
//     },
//     "30d": {
//       // Aggregate by day
//       format: "yyyy-MM-dd",
//       step: 24 * 60 * 60 * 1000, // 1 day in milliseconds
//       previousCount: 29, // 29 previous days to make it total 30 days
//       nextCount: 0, // No next days as it covers the range till today
//     },
//   };

//   const { format, step, previousCount, nextCount } = aggregation[period];

//   const currentDate = new Date();

//   // Calculate the start date based on the period
//   const startDate = new Date(
//     currentDate.getTime() - (previousCount + nextCount + 1) * step
//   );

//   // Generate x-values for the previous days
//   for (let i = previousCount; i >= 0; i--) {
//     const timestamp = new Date(startDate.getTime() + step * i);
//     const x = formatDate(timestamp, format);
//     data.push({ x, y: 0 });
//   }

//   // Aggregate the actual data points
//   for (const pageView of pageViews) {
//     const timestamp = new Date(pageView.timestamp);
//     const x = formatDate(timestamp, format);

//     const existingData = data.find(item => item.x === x);
//     if (existingData) {
//       existingData.y++;
//     } else {
//       data.push({ x, y: 1 });
//     }
//   }

//   // Sort the data array by x-values in ascending order
//   data.sort((a, b) => new Date(a.x) - new Date(b.x));

//   return data;
// }

// function formatDate(date, format) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");

//   return format
//     .replace("yyyy", year)
//     .replace("MM", month)
//     .replace("dd", day)
//     .replace("HH", hours)
//     .replace("mm", minutes);
// }
