import { GoogleLogin } from '@react-oauth/google';

export function Login() {
  return (
    <>
      <GoogleLogin
        onSuccess={(credResponse) => {
          console.log(credResponse);
        }}
        onError={() => {
          console.log('login failed');
        }}
      />
    </>
  );
}
