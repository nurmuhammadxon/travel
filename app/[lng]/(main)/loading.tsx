import { Loading } from "@/components/_components/loading";

export default function MainLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-primary">
            <Loading className="h-10 w-10 text-white" />
        </div>
    );
}