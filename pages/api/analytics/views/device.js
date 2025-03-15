import axios from 'axios';

const getMockData = () => {
  return [
    { device: 'Desktop', visits: 0 },
    { device: 'Mobile', visits: 0 },
    { device: 'Tablet', visits: 0 }
  ];
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const {handle} = req.query;

    if (!handle || typeof handle !== 'string') {
      return res.status(404).end();
    }

    // 如果没有配置 Tinybird token，返回模拟数据
    if (!process.env.DEVICE_ANALYTICS_TOKEN) {
      return res.status(200).json(getMockData());
    }

    const endpoint = 'https://api.tinybird.co/v0/pipes/libre_device_tracking.json';

    try {
      const analytics = await axios.get(
        `${endpoint}?token=${process.env.DEVICE_ANALYTICS_TOKEN}&handle=/${handle}`
      );

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
