import { TourForm } from "@/components/admin/tours/tour-form";

export default function NewTourPage() {
    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-semibold">Yangi tur qo&apos;shish</h1>
            </div>
            <TourForm />
        </div>
    );
}