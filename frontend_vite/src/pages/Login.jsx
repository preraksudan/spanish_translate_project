function Login() {
  return (
    <>

      <blockquote class="blockquote">
        <p>Login Page</p>
      </blockquote>
      <form>
        <div class="row">
          <div class="col">
            <input type="text" class="form-control" placeholder="Enter email" name="email" />
          </div>
          <div class="col">
            <input type="password" class="form-control" placeholder="Enter password" name="pswd" />
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;