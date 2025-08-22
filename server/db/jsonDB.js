// 간단한 JSON 기반 데이터베이스 (MongoDB 대체)
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data.json');

// 초기 데이터
const initialData = {
  users: [
    {
      _id: 'user1',
      username: 'testuser',
      email: 'test@bobmap.com',
      password: '$2b$10$YourHashedPasswordHere', // bcrypt 해시 (실제로는 'test123')
      trustScore: 80,
      followerCount: 10,
      followingCount: 5,
      createdAt: new Date().toISOString()
    }
  ],
  restaurants: [],
  playlists: []
};

// DB 파일 초기화
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

// 데이터 읽기
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return initialData;
  }
};

// 데이터 쓰기
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// MongoDB 스타일 API
const db = {
  users: {
    find: (query = {}) => {
      const data = readDB();
      if (Object.keys(query).length === 0) return data.users;
      
      return data.users.filter(user => {
        return Object.keys(query).every(key => user[key] === query[key]);
      });
    },
    
    findOne: (query) => {
      const data = readDB();
      return data.users.find(user => {
        return Object.keys(query).every(key => user[key] === query[key]);
      });
    },
    
    create: (userData) => {
      const data = readDB();
      const newUser = {
        _id: Math.random().toString(36).substr(2, 9),
        ...userData,
        createdAt: new Date().toISOString()
      };
      data.users.push(newUser);
      writeDB(data);
      return newUser;
    },
    
    updateOne: (query, update) => {
      const data = readDB();
      const index = data.users.findIndex(user => {
        return Object.keys(query).every(key => user[key] === query[key]);
      });
      
      if (index !== -1) {
        data.users[index] = { ...data.users[index], ...update.$set };
        writeDB(data);
        return data.users[index];
      }
      return null;
    }
  },
  
  restaurants: {
    find: (query = {}) => {
      const data = readDB();
      return data.restaurants;
    },
    
    create: (restaurantData) => {
      const data = readDB();
      const newRestaurant = {
        _id: Math.random().toString(36).substr(2, 9),
        ...restaurantData,
        createdAt: new Date().toISOString()
      };
      data.restaurants.push(newRestaurant);
      writeDB(data);
      return newRestaurant;
    }
  }
};

module.exports = db;