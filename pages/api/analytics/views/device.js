import axios from 'axios';

const getMockData = () => {
  return [
    { device: 'Desktop', visits: 0 },
    { device: 'Mobile', visits: 0 },
    { device: 'Tablet', visits: 0 }
  ];
};

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const {handle} = req.query;

    if (!handle || typeof handle !== 'string') {
      return res.status(404).end();
    }

    // 检查缓存
    const cachedData = cache.get(handle);
    if (cachedData) {
      const { data, timestamp } = cachedData;
      if (Date.now() - timestamp < CACHE_DURATION) {
        return res.status(200).json(data);
      }
      cache.delete(handle);
    }

    // 如果没有配置 Tinybird token，返回模拟数据
    if (!process.env.DEVICE_ANALYTICS_TOKEN) {
      const mockData = getMockData();
      cache.set(handle, { data: mockData, timestamp: Date.now() });
      return res.status(200).json(mockData);
    }

    const endpoint = 'https://api.tinybird.co/v0/pipes/libre_device_tracking.json';

    try {
      const analytics = await axios.get(
        `${endpoint}?token=${process.env.DEVICE_ANALYTICS_TOKEN}&handle=/${handle}`
      );

      // 存入缓存
      cache.set(handle, { 
        data: analytics.data.data, 
        timestamp: Date.now() 
      });

      return res.status(200).json(analytics.data.data);
    } catch (error) {
      // Tinybird API 调用失败时返回模拟数据
      return res.status(200).json(getMockData());
    }
  } catch (error) {
    // 其他错误时也返回模拟数据
    return res.status(200).json(getMockData());
  }
}
