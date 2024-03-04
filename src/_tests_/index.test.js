import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import fetchMock from "fetch-mock-jest";

import ColorPicker from "../pages/index";

describe("Obtains more information about the color", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    fetchMock.get("begin:https://www.thecolorapi.com/id", () => ({
      name: {
        value: "Cobalt",
        closest_named_hex: "#0047AB",
        exact_match_name: true,
        distance: 0,
      },
    }));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();

    fetchMock.reset();
  });

  test("Fetches from color API", async () => {
    render(<ColorPicker />);
    // API should be queried on initial render to obtain more information about the color
    const named = await screen.findByText(/Cobalt 🎯/);
    expect(named).toBeInTheDocument();
    expect(fetchMock).toHaveLastFetched(
      "https://www.thecolorapi.com/id?rgb=(0,0,0)",
      "get",
    );
  });

  test("Change to color fetches", async () => {
    render(<ColorPicker />);

    const redSlider = screen.getByTestId("Red_range");
    fireEvent.change(redSlider, { target: { value: 100 } });

    // No requests should have occurred to due to debouncing
    expect(fetchMock).toHaveFetchedTimes(0);

    // Advance any timers to make actual updates
    jest.runAllTimers();
    const named = await screen.findByText(/Cobalt 🎯/);
    expect(named).toBeInTheDocument();

    expect(fetchMock).toHaveFetchedTimes(
      1,
      "https://www.thecolorapi.com/id?rgb=(100,0,0)",
      "get",
    );
  });

  test("Changes are debounced", async () => {
    render(<ColorPicker />);

    const redSlider = screen.getByTestId("Red_range");
    fireEvent.change(redSlider, { target: { value: 100 } });
    jest.advanceTimersByTime(10);
    fireEvent.change(redSlider, { target: { value: 101 } });

    // No requests should have occurred to due to debouncing
    expect(fetchMock).toHaveFetchedTimes(0);

    // Advance any timers to make actual updates
    jest.runAllTimers();
    const named = await screen.findByText(/Cobalt 🎯/);
    expect(named).toBeInTheDocument();

    expect(fetchMock).toHaveFetchedTimes(
      1,
      "https://www.thecolorapi.com/id?rgb=(101,0,0)",
      "get",
    );
  });

  test("Updates to exact match", async () => {
    fetchMock.reset();
    fetchMock.get("https://www.thecolorapi.com/id?rgb=(0,0,0)", () => ({
      name: {
        value: "Cobalt",
        closest_named_hex: "#0047AB",
        exact_match_name: false,
        distance: 0,
      },
    }));
    fetchMock.get("https://www.thecolorapi.com/id?rgb=(0,71,171)", () => ({
      name: {
        value: "Cobalt",
        closest_named_hex: "#0047AB",
        exact_match_name: true,
        distance: 0,
      },
    }));

    render(<ColorPicker />);
    jest.runAllTimers();

    // When there is not an exact match we want to enable a switch
    expect(await screen.findByText(/Cobalt/)).toBeInTheDocument();
    expect(screen.queryByText(/🎯/)).not.toBeInTheDocument();

    const update = screen.getByRole("button", { name: /Switch/i });
    expect(update).toBeInTheDocument();

    // Clicking the switch button updates color
    fireEvent.click(update);
    const swatch = screen.getByTestId("swatch");
    await waitFor(() =>
      expect(swatch).toHaveStyle(`background: rgb(0,71,171);`),
    );

    jest.runAllTimers();
    expect(fetchMock).toHaveLastFetched(
      "https://www.thecolorapi.com/id?rgb=(0,71,171)",
      "get",
    );
    // Now we should have an exact match by definition
    const named = await screen.findByText(/Cobalt 🎯/);
    expect(named).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Switch/i }),
    ).not.toBeInTheDocument();
  });
});
