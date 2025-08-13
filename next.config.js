/** @type {import('next').NextConfig} */  
const nextConfig = {  
    experimental: {  
      workerThreads: false,  
      cpus: 1  
    },  
    webpack: (config, { dev }) => {  
      if (dev) {  
        config.optimization = {  
          ...config.optimization,  
          splitChunks: {  
            chunks: 'all',  
            maxSize: 244000,  
            cacheGroups: {  
              default: {  
                minChunks: 1,  
                priority: -20,  
                reuseExistingChunk: true  
              }  
            }  
          }  
        }  
        // Reduce memory usage  
        config.cache = false  
      }  
      return config  
    }  
  }  
    
  module.exports = nextConfig