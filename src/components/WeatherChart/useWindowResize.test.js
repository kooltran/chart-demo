import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useWindowResize } from "./useWindowResize";

test("should return new size of window", () => {
  const { result } = renderHook(() => useWindowResize());

  expect(result.current).toBe(1024);

  act(() => {
    window.innerWidth = 500;
    window.innerHeight = 500;

    fireEvent(window, new Event("resize"));
  });

  expect(result.current).toBe(500);
});
