import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../components/Home";
import App from "../App";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import DisplayGift from "../components/DisplayGift"; // Updated import for gift display component
import ApplyForm from "../components/ApplyForm"; // Form for applying to become a gift

test("renders_home_component_with_title_and_description", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByText("Welcome to the Gift Application")).toBeInTheDocument(); // Updated title
  expect(screen.getByText(/Join our community of skilled gift providers and bring joy to every occasion!/)).toBeInTheDocument(); // Updated description
});

test("home_component_renders_become_a_gift_provider_button_with_link_to_apply", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  // Check if the "Apply Now" button is rendered with the correct link
  const applyButton = screen.getByText("Become a Gift Provider"); // Updated button text

  expect(applyButton).toBeInTheDocument();
  expect(applyButton).toHaveAttribute("href", "/apply");
});

test("renders_navbar_in_App_component_with_links", () => {
  render(<App />);

  // Update to match the rendered title
  const titleElement = screen.getByText("Gift Application"); 
  const homeLink = screen.getByText("Home");
  const giftDetailsLink = screen.getByText("Gift Details");

  expect(titleElement).toBeInTheDocument();
  expect(homeLink).toBeInTheDocument();
  expect(giftDetailsLink).toBeInTheDocument();
});


test("checks_link_destinations", () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );

  // Check if the links have the correct destinations
  const homeLink = screen.getByText("Home");
  const giftDetailsLink = screen.getByText("Gift Details"); // Updated link text

  expect(homeLink).toHaveAttribute("href", "/");
  expect(giftDetailsLink).toHaveAttribute("href", "/getAllGifts"); // Updated route
});

test("renders_footer_component_with_copyright_text", () => {
  render(<Footer />);

  // Check if the copyright text is rendered
  const copyrightText = screen.getByText(
    /© 2024 Gift Application. All rights reserved./i // Updated copyright text
  );

  expect(copyrightText).toBeInTheDocument();
});

test("fetching_and_displaying_gift_applications", async () => {
  // Mocked data to simulate the response from the API
  const MOCK_DATA = [
    {
      name: "Sophia",
      giftCategories: "Personalized Gifts",
      experience: 5,
      specialization: "Custom Crafting",
      phoneNumber: "+911234567890",
    },
    {
      name: "Anderson",
      giftCategories: "Handmade Crafts",
      experience: 3,
      specialization: "Luxury Gifting Solutions",
      phoneNumber: "+910987654321",
    },
  ];

  // Mock the fetch function to return the mocked data
  const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(MOCK_DATA),
  });

  render(<DisplayGift />); // Updated to render DisplayGift

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check if each gift is displayed in the table
  await waitFor(() => {
    MOCK_DATA.forEach((application) => {
      expect(screen.getByText(application.name)).toBeInTheDocument();
      expect(screen.getByText(application.giftCategories)).toBeInTheDocument();
      expect(screen.getByText(application.experience)).toBeInTheDocument();
      expect(screen.getByText(application.specialization)).toBeInTheDocument();
      expect(screen.getByText(application.phoneNumber)).toBeInTheDocument();
    });
  });

  // Validate the fetch function call
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining("/getAllGifts"), // Updated to match gift API
    expect.objectContaining({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
  fetchMock.mockRestore();
});

test('submits_valid_application_form', async () => {
  render(
    <MemoryRouter>
      <ApplyForm />
    </MemoryRouter>
  );

  // Check if the form has rendered correctly
  screen.debug(); // Add this line to log the current HTML structure

  // Fill in the form
  fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Sophia' } });
  fireEvent.change(screen.getByLabelText('Gift Categories:'), { target: { value: 'Personalized Gifts' } });
  fireEvent.change(screen.getByLabelText('Experience (Years):'), { target: { value: 5 } }); // Update label text if needed
  fireEvent.change(screen.getByLabelText('Specialization:'), { target: { value: 'Custom Crafting' } });
  fireEvent.change(screen.getByLabelText('Phone Number:'), { target: { value: '+911234567890' } });

  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });

  // Submit the form
  fireEvent.click(screen.getByText('Submit Application'));

  // Wait for the success modal to appear
  await waitFor(() => {
    expect(screen.getByText('Application submitted successfully!')).toBeInTheDocument(); 
  });

  fetchMock.mockRestore();
});


test('submits_invalid_application_form', () => {
  render(
    <MemoryRouter>
      <ApplyForm />
    </MemoryRouter>
  );

  // Attempt to submit without filling in the form
  const submitButton = screen.getByText('Submit Application');
  fireEvent.click(submitButton);

  // Check for validation error messages
  expect(screen.getByText('Name is required')).toBeInTheDocument();
  expect(screen.getByText('Gift categories are required')).toBeInTheDocument(); // Updated validation message
  expect(screen.getByText('Experience is required')).toBeInTheDocument(); // Updated validation message
  expect(screen.getByText('Specialization is required')).toBeInTheDocument(); // Updated validation message
  expect(screen.getByText('Phone Number is required')).toBeInTheDocument();
});

test('checks_all_components_and_routes', () => {
  render(<App />);
  
  const homeLink = screen.getByText(/Home/i);
  fireEvent.click(homeLink);
  expect(screen.getByText('Welcome to the Gift Application')).toBeInTheDocument(); // Updated title
  
  const applyLink = screen.getByText('Become a Gift Provider'); // Updated to match button text
  fireEvent.click(applyLink);
  expect(screen.getByText('Apply to Become a Gift Provider')).toBeInTheDocument(); // Update to match title

  const giftDetailsLink = screen.getByText('Gift Details'); // Updated to match link text
  fireEvent.click(giftDetailsLink);
  expect(screen.getByText('Submitted Gift Applications')).toBeInTheDocument(); // Update to match display title
});
