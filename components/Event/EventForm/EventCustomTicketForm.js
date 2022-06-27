// import $ from "jquery";
// import React, { useState, useEffect } from "react";
// import { ErrorMessage } from "@hookform/error-message";

// function EventCustomTicketForm(props) {
//   // color class name gold, silver platinum

//   useEffect(() => {
//     $(".input-group .form-control").on("focus", function () {
//       $(this).parent().css({
//         "border-color": "#2DC774",
//         color: "#2DC774",
//       });
//     });
//     $(".input-group .form-control").on("focusout", function () {
//       $(this).parent().css({
//         "border-color": "#E9ECF0",
//         color: "#A5ADC1",
//       });
//     });
//   });

//   const {
//     inputFields,
//     handleRemoveFields,
//     handleInputChange,
//     handleAddFields,
//     register,
//     data,
//     errors,
//   } = props;

//   return (
//     <>
//       <label className="text-gray-1 mt-4">Create Custom Tickets</label>
//       <div className="custom_ticket row row-cols-md-3">
//         {inputFields.map((inputField, index) => {
//           <div className="col" key={index}>
//             <button
//               className="btn btn-link"
//               type="button"
//               onClick={() => handleRemoveFields(index)}
//             >
//               X
//             </button>
//             <div className="silver item border-radius-10">
//               <div className="d-flex justify-content-between">
//                 <input
//                   className="form-control title"
//                   type="text"
//                   name="ticketName"
//                   {...register("ticketName", {
//                     required: "This is required.",
//                   })}
//                   defaultValue={inputField.ticketName}
//                   value={inputField.ticketName}
//                   onChange={(event) => handleInputChange(index, event)}
//                   placeholder="Silver"
//                 />
//                 <i className="ri-pencil-fill cursor-pointer" />
//               </div>
//               <label htmlFor>Price</label>
//               <input
//                 className="form-control"
//                 type="number"
//                 name="price"
//                 {...register("price", {
//                   required: "This is required.",
//                 })}
//                 defaultValue={inputField.price}
//                 value={inputField.price}
//                 onChange={(event) => handleInputChange(index, event)}
//                 min={1}
//               />
//               <ErrorMessage
//                 errors={errors}
//                 name="price"
//                 render={({ messages }) =>
//                   messages &&
//                   Object.entries(messages).map(([type, message]) => (
//                     <p key={type} style={{ color: "red" }}>
//                       {message}
//                     </p>
//                   ))
//                 }
//               />
//               <label htmlFor>Currency</label>
//               <select
//                 className="form-control form-select"
//                 name="currency"
//                 {...register("currency", {
//                   required: "This is required.",
//                 })}
//                 defaultValue={inputField.currency}
//                 value={inputField.currency}
//                 onChange={(event) => handleInputChange(index, event)}
//               >
//                 <option value="$ USD">$ USD</option>
//                 <option value="€ EUR">€ EUR</option>
//                 <option value="$ AUD">$ AUD</option>
//                 <option value="৳ BDT">৳ BDT</option>
//                 <option value="$ USD">$ USD</option>
//               </select>
//               <ErrorMessage
//                 errors={errors}
//                 name="currency"
//                 render={({ messages }) =>
//                   messages &&
//                   Object.entries(messages).map(([type, message]) => (
//                     <p key={type} style={{ color: "red" }}>
//                       {message}
//                     </p>
//                   ))
//                 }
//               />
//             </div>
//           </div>;
//         })}
//       </div>
//       <pre>{JSON.stringify(inputFields, null, 2)}</pre>
//       <button
//         className="btn add-ticket light-btn btn-outline-primary mt-4 mb-250"
//         type="button"
//         style={{
//           background: "rgba(82, 50, 248, 0.03)",
//           border: "2px",
//           borderStyle: "dashed",
//           borderColor: "#E6EDF5",
//         }}
//         onClick={() => handleAddFields()}
//       >
//         Add New Ticket
//       </button>
//     </>
//   );
// }

// export default EventCustomTicketForm;
