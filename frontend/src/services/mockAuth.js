// Mock authentication service for development/demo purposes
export const mockAuthAPI = {
  login: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Accept the demo credentials
    if (email === 'admin@gatex.com' && password === 'password') {
      return {
        data: {
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: '1',
            name: 'Admin User',
            email: 'admin@gatex.com',
            role: 'admin',
            avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
          }
        }
      }
    }
    
    throw {
      response: {
        data: {
          message: 'Invalid email or password'
        }
      }
    }
  }
}
