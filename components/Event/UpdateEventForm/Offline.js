import React, { Fragment, useState, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
// import { GoogleMap, LoadScript } from "@react-google-maps/api";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import GoogleMapView from "../../GoogleMapView";
//import GoogleMap  from "@react-google-maps/api";
const containerStyle = {
  width: "810px",
  height: "400px",
};

const center = {
  lat: 23.7569419,
  lng: 90.3669858,
};
function OfflineForm({
  register,
  setFormValues,
  data,
  currentEventData = null,
  errors,
  setIsLocationError,
  isLocationError,
  setLocationData,
}) {
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  /* map api*/
  const [address, setAddress] = useState();
  const [addressObj, setAddressObj] = useState();
  const [postalCode, setPostalCode] = useState();
  const [province, setProvince] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [address1, setAddress1] = useState();
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [zoom, setZoom] = useState(0);
  const [mapActive, setMapActive] = useState(true);

  const getAddressObject = (address_components) => {
    const ShouldBeComponent = {
      street_number: ["street_number"],
      postal_code: ["postal_code"],
      street: ["street_address", "route"],
      province: [
        "administrative_area_level_1",
        "administrative_area_level_2",
        "administrative_area_level_3",
        "administrative_area_level_4",
        "administrative_area_level_5",
      ],
      city: [
        "locality",
        "sublocality",
        "sublocality_level_1",
        "sublocality_level_2",
        "sublocality_level_3",
        "sublocality_level_4",
      ],
      country: ["country"],
    };

    let address = {
      street_number: "",
      postal_code: "",
      street: "",
      province: "",
      city: "",
      country: "",
    };

    address_components.forEach((component) => {
      for (var shouldBe in ShouldBeComponent) {
        if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
          if (shouldBe === "country") {
            address[shouldBe] = component.long_name;
          } else {
            address[shouldBe] = component.long_name;
          }
        }
      }
    });

    // Fix the shape to match our schema
    address.address = address.street_number + " " + address.street;
    delete address.street_number;
    delete address.street;
    if (address.country === "US") {
      address.state = address.province;
      delete address.province;
    }
    return address;
  };

  useEffect(() => {
    console.log("address => " + JSON.stringify(address));
    const func = async () => {
      const geocodeObj =
        address &&
        address.value &&
        (await geocodeByPlaceId(address.value.place_id));
      if (geocodeObj) {
        console.log(geocodeObj[0].geometry.location.lat().toFixed(4));
        console.log(geocodeObj[0].geometry.location.lng().toFixed(4));
        let Lat = Number(geocodeObj[0].geometry.location.lat().toFixed(4));
        let Lng = Number(geocodeObj[0].geometry.location.lng().toFixed(4));
        setLat(Lat);
        setLng(Lng);
        setZoom(20);
      }
      const addressObject =
        geocodeObj && getAddressObject(geocodeObj[0].address_components);
      setAddressObj(addressObject);
      if (addressObject) {
        console.log("addressObject: : " + JSON.stringify(addressObject));
        addressObject.postal_code
          ? setPostalCode(addressObject.postal_code)
          : "";
        addressObject.province ? setProvince(addressObject.province) : "";
        addressObject.city ? setCity(addressObject.city) : "";
        addressObject.country ? setCountry(addressObject.country) : "";
        addressObject.address ? setAddress1(addressObject.address) : "";

        let d = {
          ...data,
          location: address.label,
          event_address_line1: addressObject.address,
          event_address_line2: "",
          event_country: addressObject.country,
          event_city_town: addressObject.city,
          event_state: addressObject.province,
          event_postal_code: addressObject.postal_code,
        };

        // console.table(d);
        setLocationData({
          location: address.label,
          event_address_line1: addressObject.address,
          event_address_line2: "",
          event_country: addressObject.country,
          event_city_town: addressObject.city,
          event_state: addressObject.province,
          event_postal_code: addressObject.postal_code,
        });
        setFormValues(d);
      }
    };
    func();
  }, [address]);

  /*map API End*/

  const setGooglePlacesAutocompleteValue = (val) => {
    console.log("setGooglePlacesAutocompleteValue(): " + JSON.stringify(val));
    setAddress(val);
    if (val) {
      setIsLocationError(false);
    } else {
      setIsLocationError(true);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setMapActive(true);
    }, 100);

    return () => {
      typeof window !== "undefined" && window.clearTimeout(t);
    };
  }, []);

  return (
    <Fragment>
      <div className="mb-4">
        <label htmlFor>Set A Location</label>
        <GooglePlacesAutocomplete
          apiKey={GOOGLE_MAPS_API_KEY}
          selectProps={{
            defaultInputValue:
              currentEventData?.event_type_details?.event_location,
            isClearable: true,
            value: address,
            onChange: setGooglePlacesAutocompleteValue,
          }}
        />
        {isLocationError && (
          <p style={{ color: "red" }}>This field is required!</p>
        )}
      </div>
      <label htmlFor>Insert Address</label>
      <div className="row row-cols-1 row-cols-sm-2">
        <div className="col">
          <div className="mb-4">
            <input
              type="text"
              {...register("event_address_line1")}
              className="form-control"
              placeholder="Address Line 1"
              // value={address1 ? address1 : null}
              defaultValue={
                currentEventData?.event_type_details?.event_address_line1
              }
            />
            <ErrorMessage
              errors={errors}
              name="event_address_line1"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p key={type} style={{ color: "red" }}>
                    {message}
                  </p>
                ))
              }
            />
          </div>
        </div>
        <div className="col">
          <div className="mb-4">
            <input
              type="text"
              {...register("event_address_line2")}
              defaultValue={
                currentEventData?.event_type_details?.event_address_line2
              }
              className="form-control"
              placeholder="Address Line 2"
            />
            <ErrorMessage
              errors={errors}
              name="event_address_line2"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p key={type} style={{ color: "red" }}>
                    {message}
                  </p>
                ))
              }
            />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <input
          {...register("event_country")}
          className="form-control"
          placeholder="Country"
          value={country ? country : null}
          defaultValue={currentEventData?.event_type_details?.event_country}
        />
        <ErrorMessage
          errors={errors}
          name="event_country"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <p key={type} style={{ color: "red" }}>
                {message}
              </p>
            ))
          }
        />
      </div>
      <div className="mb-4">
        <input
          {...register("event_city_town")}
          className="form-control"
          placeholder="City / Town"
          value={city ? city : null}
          defaultValue={currentEventData?.event_type_details?.event_city_town}
        />

        <ErrorMessage
          errors={errors}
          name="event_city_town"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <p key={type} style={{ color: "red" }}>
                {message}
              </p>
            ))
          }
        />
      </div>
      <div className="row row-cols-1 row-cols-sm-2">
        <div className="col">
          <div className="mb-4">
            <input
              type="text"
              {...register("event_state")}
              defaultValue={currentEventData?.event_type_details?.event_state}
              className="form-control"
              placeholder="State / Province"
              value={province ? province : null}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="event_state"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <p key={type} style={{ color: "red" }}>
                  {message}
                </p>
              ))
            }
          />
        </div>
        <div className="col">
          <div className="mb-4">
            <input
              type="text"
              {...register("event_postal_code")}
              defaultValue={
                currentEventData?.event_type_details?.event_postal_code
              }
              className="form-control"
              placeholder="Postal Code"
              value={postalCode ? postalCode : null}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="event_postal_code"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <p key={type} style={{ color: "red" }}>
                  {message}
                </p>
              ))
            }
          />
        </div>
      </div>

      {lat && <GoogleMapView lat={lat} lng={lng} zoom={15} />}
    </Fragment>
  );
}

export default OfflineForm;
