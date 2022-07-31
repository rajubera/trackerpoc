import { useEffect, useRef, useState } from "react";
declare const faceIO: any;

interface FaceIoInstance {
  authenticate(arg0: { locale: string }): any;
  enroll: (arg0: { locale: string; payload: { name: string } }) => any;
}
function Auth(props: { onLoginSuccess: (u: any) => void }) {
  const [authPage, setAuthPage] = useState("");
  const [name, setName] = useState("");
  const [faceio, setFaceIo] = useState<FaceIoInstance>();
  useEffect(() => {
    const faceioInstance: FaceIoInstance = new faceIO("fioa94cd");
    setFaceIo(faceioInstance);
  }, []);
  const handleLogIn = async () => {
    if (!faceio) {
      throw new Error("faceio not defined");
    }
    try {
      let response = await faceio.authenticate({
        locale: "auto",
      });

      console.log(
        ` Unique Facial ID: ${response.facialId}
            PayLoad:
            `,
        response.payload
      );
      if (props.onLoginSuccess) {
        props.onLoginSuccess(response.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSignup = async () => {
    if (!faceio) {
      throw new Error("faceio not defined");
    }
    try {
      let response = await faceio.enroll({
        locale: "auto",
        payload: {
          name: name,
        },
      });
      goToLogin();
    } catch (error) {
      console.log(error);
    }
  };
  const goToSignup = () => {
    setAuthPage("signup");
  };
  const goToLogin = () => {
    setAuthPage("");
  };
  return !authPage ? (
    <>
      <div className="card auth-btns">
        <button onClick={handleLogIn}>Login</button>
        <button onClick={goToSignup}>Go to Signup</button>
      </div>
      <p className="read-the-docs">
        Please click signup if you don't have account, otherwise click Login
      </p>
    </>
  ) : (
    <>
      <div className="card auth-btns">
        <input
          type="text"
          required
          onChange={(e) => setName(e.target.value)}
        ></input>
        <button onClick={handleSignup}>Signup</button>
      </div>
      <p className="read-the-docs">
        <a onClick={goToLogin}>Back to Login</a>
      </p>
    </>
  );
}

export default Auth;
