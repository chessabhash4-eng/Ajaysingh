export default function RollText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`group/roll relative inline-flex overflow-hidden ${className}`}>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover/roll:-translate-y-full">{text}</span>
      <span className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover/roll:-translate-y-full">
        {text}
      </span>
    </span>
  );
}
