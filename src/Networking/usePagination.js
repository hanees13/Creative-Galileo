import React, {useState, useEffect, useCallback} from 'react';
import Realm from 'realm';

const CustomerSchema = {
  name: 'Customer',
  properties: {
    id: 'string',
    cgId: 'int',
    name: 'string',
    mobile: 'string',
    dialCode: 'string',
    email: 'string',
    recordStatus: 'bool',
    createdAt: 'date',
    updatedAt: 'date',
  },
  primaryKey: 'id',
};

const initialData = {
  data: [],
  totalResult: 0,
  status: true,
  pageNo: 1,
  totalPages: 1,
};

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNDAwOGQzNS01OTlhLTQ4YzAtYWQ2My03NmY4N2UyZGIwYzMiLCJlbnRpdHlUeXBlIjoidXNlciIsInYiOiIwLjEiLCJpYXQiOjE3MDE3OTk1NzgsImV4cCI6MTczMzM1NzE3OH0.aolRFer6LQ9JboZT7pDqb3Eq2SGOcUwGRRTzG2mfPJ4';

const usePagination = () => {
  const [initialLoader, setInitialLoader] = useState(true);
  const [data, setData] = useState(initialData.data);
  const [totalResult, setTotalResult] = useState(initialData.totalResult);
  const [pageNo, setPageNo] = useState(initialData.pageNo);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const openRealm = async () => {
    return await Realm.open({schema: [CustomerSchema]});
  };

  const storeDataInRealm = async customers => {
    const realm = await openRealm();
    try {
      realm.write(() => {
        customers.forEach(customer => {
          const customerData = {
            id: customer.id,
            cgId: customer.cgId,
            name: customer.name,
            mobile: customer.mobile,
            dialCode: customer.dialCode,
            email: customer.email,
            recordStatus: customer.recordStatus,
            createdAt: new Date(customer.createdAt),
            updatedAt: new Date(customer.updatedAt),
          };
          realm.create('Customer', customerData, Realm.UpdateMode.Modified);
        });
      });
    } catch (error) {
      console.error('Error storing data in Realm:', error);
    } finally {
      realm.close();
    }
  };

  const getDataFromRealm = async page => {
    const realm = await openRealm();
    try {
      const customers = realm
        .objects('Customer')
        .slice((page - 1) * 10, page * 10);

      const copiedData = customers.map(customer => ({
        id: customer.id,
        cgId: customer.cgId,
        name: customer.name,
        mobile: customer.mobile,
        dialCode: customer.dialCode,
        email: customer.email,
        recordStatus: customer.recordStatus,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      }));

      return copiedData.length ? copiedData : null;
    } catch (error) {
      console.error('Error fetching data from Realm:', error);
      return null;
    } finally {
      realm.close();
    }
  };

  const fetchData = async (page, perPage = 10) => {
    const realmData = await getDataFromRealm(page);
    console.log('realmData >>>>>>>>>>>', page);

    if (realmData && realmData.length) {
      const uniqueFilteredData = realmData.filter(
        newCustomer =>
          !data.some(
            existingCustomer => existingCustomer.id === newCustomer.id,
          ),
      );
      const result = {
        data: realmData,
        totalResult: realmData?.total,
        status: true,
        pageNo: page,
        totalPages: Math.ceil(166567 / perPage) || 10,
      };
      setTotalResult(result.totalResult);
      setPageNo(result.pageNo);
      setTotalPages(result.totalPages);
      setData(
        page === 1 ? uniqueFilteredData : [...data, ...uniqueFilteredData],
      );
      setInitialLoader(false);
      setRefreshing(false);
      setLoadingMore(false);
    } else {
      try {
        const response = await fetch(
          `https://cgv2.creativegalileo.com/api/V1/customer/filter?paginated=true&pageNo=${page}&pageSize=${perPage}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        const resultOld = await response.json();
        const result = {
          data: resultOld?.data?.customers,
          totalResult: resultOld?.total,
          status: true,
          pageNo: page,
          totalPages: Math.ceil(resultOld?.data?.count / perPage) || 10,
        };

        if (result.status) {
          const filteredData = result.data.filter(
            customer =>
              customer.email &&
              customer.email.trim() !== '' &&
              customer.name &&
              customer.name.trim() !== '',
          );
          const uniqueFilteredData = filteredData.filter(
            newCustomer =>
              !data.some(
                existingCustomer => existingCustomer.id === newCustomer.id,
              ),
          );
          if (page === 1) {
            setData(uniqueFilteredData);
          } else {
            setData([...data, ...uniqueFilteredData]);
          }
          setTotalResult(result.totalResult);
          setPageNo(result.pageNo);
          setTotalPages(result.totalPages);

          storeDataInRealm(uniqueFilteredData);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setRefreshing(false);
        setLoadingMore(false);
        setInitialLoader(false);
      }
    }
  };

  useEffect(() => {
    fetchData(pageNo);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(1);
  }, []);

  const loadMore = () => {
    if (!loadingMore && pageNo < totalPages) {
      setLoadingMore(true);
      fetchData(pageNo + 1);
    }
  };

  return {
    data,
    totalResult,
    refreshing,
    loadingMore,
    handleRefresh,
    loadMore,
    initialLoader,
  };
};
export default usePagination;
