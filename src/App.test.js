import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders application title", () => {
  render(<App />);

  const title = screen.getByRole("heading", {
    name: /шифрування та розшифрування тексту/i,
  });

  expect(title).toBeInTheDocument();
});
