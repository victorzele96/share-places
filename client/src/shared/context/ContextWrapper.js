import { FavoritesContextProvider } from "./favorites-context";
import { PlaceContextProvider } from "./place-context";

const ContextWrapper = ({ children }) => {
  return (
    <PlaceContextProvider>
      <FavoritesContextProvider>
        {children}
      </FavoritesContextProvider>
    </PlaceContextProvider>
  );
};

export default ContextWrapper