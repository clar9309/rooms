import Link from "next/link";

function SignUpSuccess() {
  return (
    <div className={`flex flex-col max-w-lg`}>
      <h3 className="text-h3 lg:text-h2 mb-5">Registration Successful!</h3>
      <p>
        Before you can log in, please verify your email by clicking the
        verification link sent to your inbox. If you do not see the email,
        please check your spam folder.
      </p>
      <span className="mt-3">
        Already verified your email? Go to{" "}
        <Link href="/login" className="font-medium">
          Login
        </Link>
      </span>
    </div>
  );
}

export default SignUpSuccess;
