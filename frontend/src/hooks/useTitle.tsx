import { useEffect } from "react";

function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} - CodeStash`;
  }, [title]);
}
export default useTitle;
