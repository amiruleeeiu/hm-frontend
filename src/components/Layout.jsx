import React, { useEffect } from "react";

export default function Layout({ title, children }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return <>{children}</>;
}
