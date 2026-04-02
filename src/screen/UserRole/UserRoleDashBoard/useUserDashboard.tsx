import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Parceldetails } from "../../../Api/apiRequest";
import { STATUS } from "../../../utils/Constant";

const getDummyOrderData = () => {
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return [
    { id: "u1", trackingId: "ORD305470", deliveryStatus: STATUS.PENDING, createdAt: base.toISOString() },
    { id: "u2", trackingId: "ORD305471", deliveryStatus: STATUS.PENDING, createdAt: base.toISOString() },
    { id: "u3", trackingId: "ORD305472", deliveryStatus: STATUS.ON_THE_WAY, createdAt: base.toISOString() },
    { id: "u4", trackingId: "ORD305473", deliveryStatus: STATUS.DELIVERED, createdAt: base.toISOString() },
    { id: "u5", trackingId: "ORD305474", deliveryStatus: STATUS.PENDING, createdAt: base.toISOString() },
  ];
};

const useUserDashboard = () => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any[]>(getDummyOrderData());

  const fetchOrders = async () => {
    try {
      const response = await Parceldetails(setLoading);
      if (response?.parcels?.length) {
        setOrderData(response.parcels);
      } else {
        setOrderData(getDummyOrderData());
      }
    } catch {
      setOrderData(getDummyOrderData());
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { navigation, isLoading, orderData };
};

export default useUserDashboard;
