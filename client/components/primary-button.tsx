import { Button } from "@/components/ui/button"

export function PrimaryButton({ content }: { content: string }) {
    return (
        <>
            {/** <Button variant="default" className="rounded-sm cursor-pointer bg-main border border-main hover:bg-main/5 hover:border hover:border hover:border-main hover:text-main"> */}
            <Button variant="default" className="rounded-sm cursor-pointer bg-main hover:bg-main/90">{content}</Button>
        </>
    )
}