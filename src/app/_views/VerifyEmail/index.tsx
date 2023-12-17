import Link from "next/link";

interface VerifyEmailProps {
  msg: string;
  error: boolean;
}

function VerifyEmail({ result }: { result: VerifyEmailProps }) {
  return (
    <div className="min-h-screen flex items-center pt-40 flex-col gap-7">
      <h3 className="text-h3 lg:text-h2">{result.msg}</h3>
      {!result.error && (
        <Link
          href="/login"
          className="text-h3 lg:text-h2 font-medium hover:font-normal"
        >
          Log in here
        </Link>
      )}
    </div>
  );
}

export default VerifyEmail;
