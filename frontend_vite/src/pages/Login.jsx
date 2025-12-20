function Login() {
  return (
    <>

      <blockquote className="blockquote">
        <p>Login Page</p>
      </blockquote>
      <form>
        <div className="row">
          <div className="col">
            <input type="text" className="form-control" placeholder="Enter email" name="email" />
          </div>
          <div className="col">
            <input type="password" className="form-control" placeholder="Enter password" name="pswd" />
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;