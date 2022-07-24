import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import CategoryList from "../../components/Event/Category/CategoryList";
import { useFormData } from "../../context";
import { useRouter } from "next/router";
import FormProgress from "../utils/FormProgress";
import {
  saveUserProfileImg,
  saveUserData,
  getAllCategories,
} from "../../services/service";
import { useAlert } from "react-alert";
import { ALERT_MESSAGE_USER_PROFILE_SETUP_SUCCESS } from "../../constants";

function AddCategoryForm({
  currentStep,
  totalStep,
  nextFormStep,
  prevFormStep,
}) {
  const { setFormValues, data } = useFormData();
  const [categoryData, setCategoryData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const {
    setValue,
    setError,
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });

  const alert = useAlert();
  const router = useRouter();

  const [token, setToken] = useState(null);

  const getSelectedCategory = (d) => {
    const selected_category = [];
    categoryData.map((d) => {
      if (d.isSelect === true) {
        return selected_category.push(d.name);
      }
    });
    return selected_category;
  };
  const [isDisableNextButton, setIsDisableNextButton] = useState(false);
  const [isDisableBackButton, setIsDisableBackButton] = useState(false);
  const onSubmit = async (d) => {
    setIsLoading(true);
    const selected_category = getSelectedCategory(d);

    if (selected_category.length > 5) {
      setIsCategoryErrorMessage("Maximum 5 Category Select!");
      setIsLoading(false);
    } else if (selected_category.length < 1) {
      setIsCategoryErrorMessage("This field is required!");
      setIsLoading(false);
    } else {
      setIsCategoryErrorMessage(null);
      data = { ...data, selected_category };

      setFormValues(data);
      console.table(data);
      // nextFormStep();
      const res = await saveUserProfileImg(data, token);

      const profileImagePath = res.image_path;
      if (res.status === 200) {
        localStorage.setItem("profileImage", profileImagePath);
        data = { ...data, profileImage: profileImagePath };
        setFormValues(data);
        const res = await saveUserData(data, token);
        setIsLoading(false);
        router.push("/event/dashboard");
        if (res.status === 200) {
          const result =
            typeof window !== "undefined"
              ? localStorage.getItem("result")
              : null;

          const tempResult = JSON.parse(result);

          const tempResultObj = {
            ...tempResult,
            profile_setup_completed: true,
          };

          localStorage.setItem("result", JSON.stringify(tempResultObj));

          alert.show(
            <div style={{ textTransform: "none" }}>
              {ALERT_MESSAGE_USER_PROFILE_SETUP_SUCCESS}
            </div>,
            {
              type: "success",
            }
          );
        } else {
          alert.show(res.message);
        }
      } else if (res.status === 401) {
        alert.show(res.msg, { type: "error" });
        setIsLoading(false);
      } else {
        alert.show(res.message);
        setIsLoading(false);
      }
    }
  };

  useEffect(async () => {
    setIsLoading(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(token);

    const res = await getAllCategories();
    if (res.status === 200) {
      const categoryDataList = res.data.map((item, index) => {
        return {
          id: index,
          name: item.name,
          icon: item.icon,
          isSelect: false,
        };
      });

      setCategoryData(categoryDataList);

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const [isCategoryErrorMessage, setIsCategoryErrorMessage] = useState(null);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} id="add-category-form">
        <div className="text-center mb-130 px-5">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gx-3 gy-2 justify-content-center">
            {categoryData.length > 0 && (
              <CategoryList
                list={categoryData}
                setCategoryData={setCategoryData}
                setIsCategoryErrorMessage={setIsCategoryErrorMessage}
              />
            )}
          </div>
          {isCategoryErrorMessage && (
            <p style={{ color: "red" }}>{isCategoryErrorMessage}</p>
          )}
        </div>
        <FormProgress
          isDisableNextButton={isDisableNextButton}
          currentStep={currentStep}
          prevFormStep={prevFormStep}
          totalStep={totalStep}
          isLoading={isLoading}
          formId={"add-category-form"}
        />
      </form>
    </>
  );
}

export default AddCategoryForm;
