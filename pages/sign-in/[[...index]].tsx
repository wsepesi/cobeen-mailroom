import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex flex-auto items-center justify-center w-[100vw] h-[100vh]">
      <SignIn path="/sign-in" routing="path" />
    </div>
  )
};

export default SignInPage;