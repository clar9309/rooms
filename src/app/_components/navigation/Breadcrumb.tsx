import Link from "next/link";

interface BreadCrumbProps {
  links: { title: string; url: string; isCurrent?: boolean }[];
}

function BreadCrumb({ links }: BreadCrumbProps) {
  return (
    <ul className="flex gap-2 mt-4 md:mt-7">
      {links.map((li, index) => (
        <li className="text-sm" key={li.url}>
          <Link
            className={`mr-2  ${index == links.length - 1 && "font-medium"}`}
            href={li.url}
          >
            {li.title}
          </Link>
          {index !== links.length - 1 && <span>/</span>}
        </li>
      ))}
    </ul>
  );
}

export default BreadCrumb;
