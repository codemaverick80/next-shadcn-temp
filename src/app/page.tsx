
import {validateRequest} from "@/auth";
import {redirect} from "next/navigation";
import Image from "next/image"
import SignIn from "@/app/(auth)/sign-in/page";
export default async function Home() {
  const { user,session } = await validateRequest();
  if(session){
    //return redirect("/dashboard");
    return redirect("/dashboard");
  }
  return (
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
              <SignIn/>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
              src="/login-side-img.jpg"
              alt="Image"
              width="600"
              height="400"
              className="h-full w-full"
          />
        </div>
      </div>
  );
}
