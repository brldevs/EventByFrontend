import React from "react";
import CategoryItem from "./CategoryItem";

function CategoryList(props) {
  const [list, setList] = React.useState(props.list);

  function toggle(id) {
    const newList = list.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          isSelect: !item.isSelect,
        };
        return updatedItem;
      }
      return item;
    });

    console.log("Total item: " + JSON.stringify(newList))
    let cnt = 0;
    newList.map((d) => {
      if (d.isSelect === true) {
        cnt++
      }
    });

    if (cnt > 5) {
      console.log("Greater Than 5")
      props.setIsCategoryErrorMessage('Maximum 5 Category Select!');
      const newList2 = list.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            isSelect: !item.isSelect,
          };
          return updatedItem;
        }
        return item;
      });

      setList(newList2);
      props.setCategoryData(newList2);
    } else {
      setList(newList);
      props.setCategoryData(newList);
      props.setIsCategoryErrorMessage(null);
    }


  }

  return list.map((category) => (
    <CategoryItem
      key={category.id}
      id={category.id}
      name={category.name}
      icon={category.icon}
      status={category.isSelect}
      click={toggle}
    />
  ));
}
export default CategoryList;
