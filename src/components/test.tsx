
import { getUser } from "~/api-services/test";

function TestPage() {
  return <div>GET USER: {getUser("user")}</div>;
}

export default TestPage;
