const getEventCreateApiData = async (data) => {
  console.log("Inside getEventCreateApiData:");
  console.table(data);
  let start_date_and_start_time;
  let end_date_and_end_time;
  let scheduled_date_and_scheduled_time;

  if (data.event_start_date) {
    start_date_and_start_time =
      new Date(data.event_start_date).toISOString().split("T")[0] +
      "T" +
      new Date(data.event_start_time).toISOString().split("T")[1];
  }
  if (data.event_end_date) {
    end_date_and_end_time =
      new Date(data.event_end_date).toISOString().split("T")[0] +
      "T" +
      new Date(data.event_end_time).toISOString().split("T")[1];
  }

  if (data.isPublishLater && data.schedule_date && data.schedule_time) {
    scheduled_date_and_scheduled_time =
      new Date(data.schedule_date).toISOString().split("T")[0] +
      "T" +
      new Date(data.schedule_time).toISOString().split("T")[1];
  }

  let event_type;
  if (data.isPhysicalEvent && !data.isOnlineEvent && !data.isHybridEvent) {
    event_type = "physical";
  }
  if (!data.isPhysicalEvent && data.isOnlineEvent && !data.isHybridEvent) {
    event_type = "online";
  }
  if (!data.isPhysicalEvent && !data.isOnlineEvent && data.isHybridEvent) {
    event_type = "hybrid";
  }

  let event_platform;
  if (data.isGoogleMeet && !data.isZoom && !data.isOthers) {
    event_platform = "Google Meet";
  }
  if (!data.isGoogleMeet && data.isZoom && !data.isOthers) {
    event_platform = "Zoom";
  }
  if (!data.isGoogleMeet && !data.isZoom && data.isOthers) {
    event_platform = "Others";
  }

  if (event_type === "physical") {
    const physicalEventInfo = {
      name: data.nameOfYourEvent,
      description: data.addASummary,
      start_date: start_date_and_start_time,
      end_date: end_date_and_end_time,
      event_type: event_type,
      planned_event_type: data.typeOfEventPlaningToHost,
      is_event_draft: data.isDraftEvent,
      is_scheduled: data.isPublishLater,
      scheduled_date_time: scheduled_date_and_scheduled_time || null,
      location: data.locationData.location,
      event_address_line1: data.locationData.event_address_line1,
      event_address_line2: data.locationData.event_address_line2,
      event_country: data.locationData.event_country,
      event_city_town: data.locationData.event_city_town,
      event_state: data.locationData.event_state,
      event_postal_code: data.locationData.event_postal_code,
    };
    return physicalEventInfo;
  } else if (event_type === "online") {
    const onlineEventInfo = {
      name: data.nameOfYourEvent,
      description: data.addASummary,
      start_date: start_date_and_start_time,
      end_date: end_date_and_end_time,
      event_type: event_type,
      planned_event_type: data.typeOfEventPlaningToHost,
      is_event_draft: data.isDraftEvent,
      is_scheduled: data.isPublishLater,
      scheduled_date_time: scheduled_date_and_scheduled_time || null,
      event_platform: event_platform,
      event_platform_link: data.event_platform_link,
    };
    return onlineEventInfo;
  } else if (event_type === "hybrid") {
    const hybridEventInfo = {
      name: data.nameOfYourEvent,
      description: data.addASummary,
      start_date: start_date_and_start_time,
      end_date: end_date_and_end_time,
      event_type: event_type,
      planned_event_type: data.typeOfEventPlaningToHost,
      is_event_draft: data.isDraftEvent,
      is_scheduled: data.isPublishLater,
      scheduled_date_time: scheduled_date_and_scheduled_time || null,
      location: data.locationData.location,
      event_address_line1: data.locationData.event_address_line1,
      event_address_line2: data.locationData.event_address_line2,
      event_country: data.locationData.event_country,
      event_city_town: data.locationData.event_city_town,
      event_state: data.locationData.event_state,
      event_postal_code: data.locationData.event_postal_code,
      event_platform: event_platform,
      event_platform_link: data.event_platform_link,
    };
    return hybridEventInfo;
  } else {
    const eventInfo = {
      name: data.nameOfYourEvent,
      description: data.addASummary,
      start_date: start_date_and_start_time,
      end_date: end_date_and_end_time,
      event_type: event_type,
      planned_event_type: data.typeOfEventPlaningToHost,
      is_event_draft: data.isDraftEvent,
      is_scheduled: data.isPublishLater,
      scheduled_date_time: scheduled_date_and_scheduled_time || null,
    };
    return eventInfo;
  }
};

const getEventTicketApiData = async (data) => {
  let ticket_type = data.isFreeTicket ? "free" : "paid";
  let sale_start_date = data.isFreeTicket
    ? data.start_date_ticket_free
    : data.start_date_ticket_paid;
  let sale_start_time = data.isFreeTicket
    ? data.start_time_ticket_free
    : data.start_time_ticket_paid;
  let sale_end_date = data.isFreeTicket
    ? data.end_date_ticket_free
    : data.end_date_ticket_paid;
  let sale_end_time = data.isFreeTicket
    ? data.end_time_ticket_free
    : data.end_time_ticket_paid;
  let custom_ticket = data.custom_ticket ? data.custom_ticket : null;

  const x = {
    ticket_type: ticket_type,
    sale_start_date: sale_start_date,
    sale_start_time: sale_start_time,
    sale_end_date: sale_end_date,
    sale_end_time: sale_end_time,
    custom_ticket: custom_ticket,
  };

  return x;
};

const getEventDraftScheduleData = async (data) => {
  console.table(data);

  let scheduled_date_time;

  if (data.schedule_date) {
    scheduled_date_time =
      new Date(data.schedule_date).toISOString().split("T")[0] +
      "T" +
      new Date(data.schedule_time).toISOString().split("T")[1];
  }

  const x = {
    is_event_draft: data.isDraftEvent,
    is_scheduled: data.isPublishLater,
    scheduled_date_time: scheduled_date_time,
  };

  return x;
};

const getRecurringEventData = async (data) => {
  if (data.recurrenceType === "Day") {
    const xDay = {
      numOfRecurrence: data.numOfRecurrence,
      recurrenceType: data.recurrenceType,
      timeInputs: data.timeInputs,
    };
    return xDay;
  } else if (data.recurrenceType === "Week") {
    const xWeek = {
      numOfRecurrence: data.numOfRecurrence,
      recurrenceType: data.recurrenceType,
      timeInputs: data.timeInputs,
      selectedDays: data.selectedDays.map((item) => {
        if (item.label === "SU") {
          return {
            day: "SUN",
            isSelected: item.isChecked,
          };
        } else if (item.label === "MO") {
          return {
            day: "MON",
            isSelected: item.isChecked,
          };
        } else if (item.label === "TU") {
          return {
            day: "TUE",
            isSelected: item.isChecked,
          };
        } else if (item.label === "WE") {
          return {
            day: "WED",
            isSelected: item.isChecked,
          };
        } else if (item.label === "TH") {
          return {
            day: "THU",
            isSelected: item.isChecked,
          };
        } else if (item.label === "FR") {
          return {
            day: "FRI",
            isSelected: item.isChecked,
          };
        } else {
          return {
            day: "SAT",
            isSelected: item.isChecked,
          };
        }
      }),
    };
    return xWeek;
  } else if (data.recurrenceType === "Month") {
    const xMonth = {
      numOfRecurrence: data.numOfRecurrence,
      recurrenceType: data.recurrenceType,
      timeInputs: data.timeInputs,
      selectedDatesForMonth: data.selectedDatesForMonth.map((item) => {
        if (item.label === " 1") {
          return {
            date: "01",
            isSelected: item.isChecked,
          };
        } else if (item.label === " 2") {
          return {
            date: "02",
            isSelected: item.isChecked,
          };
        } else if (item.label === "3") {
          return {
            date: "03",
            isSelected: item.isChecked,
          };
        } else if (item.label === "4") {
          return {
            date: "04",
            isSelected: item.isChecked,
          };
        } else if (item.label === "5") {
          return {
            date: "05",
            isSelected: item.isChecked,
          };
        } else if (item.label === "6") {
          return {
            date: "06",
            isSelected: item.isChecked,
          };
        } else if (item.label === "7") {
          return {
            date: "07",
            isSelected: item.isChecked,
          };
        } else if (item.label === "8") {
          return {
            date: "08",
            isSelected: item.isChecked,
          };
        } else if (item.label === "9") {
          return {
            date: "09",
            isSelected: item.isChecked,
          };
        } else if (item.label === "10") {
          return {
            date: "10",
            isSelected: item.isChecked,
          };
        } else if (item.label === "11") {
          return {
            date: "11",
            isSelected: item.isChecked,
          };
        } else if (item.label === "12") {
          return {
            date: "12",
            isSelected: item.isChecked,
          };
        } else if (item.label === "13") {
          return {
            date: "13",
            isSelected: item.isChecked,
          };
        } else if (item.label === "14") {
          return {
            date: "14",
            isSelected: item.isChecked,
          };
        } else if (item.label === "15") {
          return {
            date: "15",
            isSelected: item.isChecked,
          };
        } else if (item.label === "16") {
          return {
            date: "16",
            isSelected: item.isChecked,
          };
        } else if (item.label === "17") {
          return {
            date: "17",
            isSelected: item.isChecked,
          };
        } else if (item.label === "18") {
          return {
            date: "18",
            isSelected: item.isChecked,
          };
        } else if (item.label === "19") {
          return {
            date: "19",
            isSelected: item.isChecked,
          };
        } else if (item.label === "20") {
          return {
            date: "20",
            isSelected: item.isChecked,
          };
        } else if (item.label === "21") {
          return {
            date: "21",
            isSelected: item.isChecked,
          };
        } else if (item.label === "22") {
          return {
            date: "22",
            isSelected: item.isChecked,
          };
        } else if (item.label === "23") {
          return {
            date: "23",
            isSelected: item.isChecked,
          };
        } else if (item.label === "24") {
          return {
            date: "24",
            isSelected: item.isChecked,
          };
        } else if (item.label === "25") {
          return {
            date: "25",
            isSelected: item.isChecked,
          };
        } else if (item.label === "26") {
          return {
            date: "26",
            isSelected: item.isChecked,
          };
        } else if (item.label === "27") {
          return {
            date: "27",
            isSelected: item.isChecked,
          };
        } else if (item.label === "28") {
          return {
            date: "28",
            isSelected: item.isChecked,
          };
        } else if (item.label === "29") {
          return {
            date: "29",
            isSelected: item.isChecked,
          };
        } else if (item.label === "30") {
          return {
            date: "30",
            isSelected: item.isChecked,
          };
        } else if (item.label === "31") {
          return {
            date: "31",
            isSelected: item.isChecked,
          };
        }
      }),
    };
    return xMonth;
  } else {
    const selectedDatesForYear = [];
    data.selectedDatesForYear.map((item) => {
      item.map((item2) => {
        selectedDatesForYear.push(item2);
      });
    });
    console.log(
      "selectedDatesForYear=====" + JSON.stringify(selectedDatesForYear)
    );
    const xYear = {
      numOfRecurrence: data.numOfRecurrence,
      recurrenceType: data.recurrenceType,
      timeInputs: data.timeInputs,
      selectedMonths: selectedDatesForYear
        .map((item) => {
          if (item.label === "JAN") {
            return {
              month: "Jan",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "FEB") {
            return {
              month: "Feb",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "MAR") {
            return {
              month: "Mar",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "APR") {
            return {
              month: "Apr",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "MAY") {
            return {
              month: "May",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "JUN") {
            return {
              month: "Jun",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "JUL") {
            return {
              month: "Jul",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "AUG") {
            return {
              month: "Aug",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "SEP") {
            return {
              month: "Sep",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "OCT") {
            return {
              month: "Oct",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "NOV") {
            return {
              month: "Nov",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "DEC") {
            return {
              month: "Dec",
              isSelected: item.isChecked,
            };
          }
        })
        .filter(function (element) {
          return element !== undefined;
        }),
      selectedDatesForYear: selectedDatesForYear
        .map((item) => {
          if (item.label === " 1") {
            return {
              date: "01",
              isSelected: item.isChecked,
            };
          }
          if (item.label === " 2") {
            return {
              date: "02",
              isSelected: item.isChecked,
            };
          }
          if (item.label === " 3") {
            return {
              date: "03",
              isSelected: item.isChecked,
            };
          }
          if (item.label === " 4") {
            return {
              date: "04",
              isSelected: item.isChecked,
            };
          }
          if (item.label === " 5") {
            return {
              date: "05",
              isSelected: item.isChecked,
            };
          }
          if (item.label === " 6") {
            return {
              date: "06",
              isSelected: item.isChecked,
            };
          }
          if (item.label === " 7") {
            return {
              date: "07",
              isSelected: item.isChecked,
            };
          }
          if (item.label === " 8") {
            return {
              date: "08",
              isSelected: item.isChecked,
            };
          }
          if (item.label === " 9") {
            return {
              date: "09",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "10") {
            return {
              date: "10",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "11") {
            return {
              date: "11",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "12") {
            return {
              date: "12",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "13") {
            return {
              date: "13",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "14") {
            return {
              date: "14",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "15") {
            return {
              date: "15",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "16") {
            return {
              date: "16",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "17") {
            return {
              date: "17",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "18") {
            return {
              date: "18",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "19") {
            return {
              date: "19",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "20") {
            return {
              date: "20",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "21") {
            return {
              date: "21",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "22") {
            return {
              date: "22",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "23") {
            return {
              date: "23",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "24") {
            return {
              date: "24",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "25") {
            return {
              date: "25",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "26") {
            return {
              date: "26",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "27") {
            return {
              date: "27",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "28") {
            return {
              date: "28",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "29") {
            return {
              date: "29",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "30") {
            return {
              date: "30",
              isSelected: item.isChecked,
            };
          }
          if (item.label === "31") {
            return {
              date: "31",
              isSelected: item.isChecked,
            };
          }
        })
        .filter(function (element) {
          return element !== undefined;
        }),
    };

    return xYear;
  }
};
module.exports = {
  getEventCreateApiData,
  getEventTicketApiData,
  getEventDraftScheduleData,
  getRecurringEventData,
};
