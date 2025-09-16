export interface Props {
  error: unknown;
}

export default function ErrorPage({ error: _ }: Props) {
  return <div>Something went wrong</div>;
}
