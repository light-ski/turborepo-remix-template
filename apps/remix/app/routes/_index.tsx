import { LoaderArgs, json } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  return null;
}
export default function Index() {
  return <div className="relative isolate overflow-hidden bg-white ">Hello World!</div>;
}
