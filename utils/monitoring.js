// 性能监控和错误跟踪工具

// 性能监控
export const measurePerformance = (componentName, startTime) => {
  if (process.env.NODE_ENV === 'development') {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`${componentName} 渲染耗时: ${duration.toFixed(2)}ms`);
  }
};

// 错误跟踪
export const trackError = (error, context = {}) => {
  console.error('错误详情:', {
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
  });

  // 在这里可以添加错误上报服务
  // 例如: Sentry, LogRocket 等
};

// 性能指标收集
export const collectMetrics = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      // 页面加载时间
      loadTime: navigation.loadEventEnd - navigation.startTime,
      // DOM内容加载时间
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      // 首次渲染时间
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      // 首次内容渲染时间
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
    };
  }
  return null;
};

// API请求计时
export const measureApiCall = async (apiCall, apiName) => {
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`API ${apiName} 调用耗时: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    trackError(error, { apiName });
    throw error;
  }
}; 