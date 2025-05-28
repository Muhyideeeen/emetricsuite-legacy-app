class TokenService {
    getLocalRefreshToken(token_name = 'tokens') {
      const user = JSON.parse(localStorage.getItem(token_name));
      return user?.refresh;
    }
  
    getLocalAccessToken(token_name = 'tokens') {
      const user = JSON.parse(localStorage.getItem(token_name));
      return user?.access;
    }
  
    updateLocalTenantTokens(tokens) {
      localStorage.setItem("client_tokens", JSON.stringify(tokens));
      // localStorage.setItem("client_tokens", JSON.stringify(tokens));
    }

    getAvailableLocalAccessToken(){
      //here we get either the tokens or the client token any one that is availabel
      const user = JSON.parse((localStorage.getItem('tokens') || localStorage.getItem('client_tokens')))
      return user?.access;

    }

    updateLocalAdminTokens(tokens) {
      localStorage.setItem("tokens", JSON.stringify(tokens));
    }
  
    getUser() {
      return JSON.parse(localStorage.getItem("tokens"));
    }
  
    setUser(user) {
      console.log(JSON.stringify(user));
      localStorage.setItem("tokens", JSON.stringify(user));
    }
  
    removeUser() {
      // localStorage.removeItem("tokens");
      localStorage.clear();
    }
  }
  
  export default new TokenService();