import { Button } from "@/components/ui/button"

type PrimaryButtonProps = {
  content: string
  onClick?: () => void
}

export function PrimaryButton({ content, onClick }: PrimaryButtonProps) {
  return (
    <>
      {/** <Button variant="default" className="rounded-sm cursor-pointer bg-main border border-main hover:bg-main/5 hover:border hover:border hover:border-main hover:text-main"> */}
      <Button
        variant="default"
        className="bg-main hover:bg-main/90 cursor-pointer rounded-sm tracking-wide"
        onClick={onClick}
      >
        {content}
      </Button>
    </>
  )
}
