import { AppLayout, Welcome } from "@/modules";

export default function About(){
  return(
    <AppLayout>
      <div className="w-full max-w-4xl px-4">
        <div className="text-center">
          <Welcome />
        </div>
      </div>
    </AppLayout>
  )
}