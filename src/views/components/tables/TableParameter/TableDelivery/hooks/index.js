import {useState, useEffect} from 'react';
import {DeleteFilled} from '@ant-design/icons';
import {Typography} from 'antd';
import {useUtils} from 'hooks';

export const useCustomDelivery = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [addingFile, setAddingFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const {
    getColumnSearchProps,
    getAllDeliveries,
    getGarmentsTableParameters,
    getTableParameters,
    getReasonsTableParameters,
    createDelivery,
    deleteUniformDelivery
  } = useUtils();
  const [garments, setGarments] = useState([]);
  const [garmentsColumns, setGarmentsColumns] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [reasonsList, setReasonsList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [formatDataSource, setFormatDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatAllDeliveries = (data) => {
    let newData = data.map((delivery) => {
      let newParamGarments = delivery.producto.garmentTypes.reduce(function (res, garmentType) {
        res[`garment${garmentType.garmentId}`] = garmentType.quantity;
        return res;
      }, {});

      let newDelivery = {
        ...delivery,
        ...delivery.producto,
        ...delivery.parameterizedReason,
        ...newParamGarments
      };
      delete newDelivery.parameterizedReason;
      delete newDelivery.producto;
      delete newDelivery.garmentTypes;
      return newDelivery;
    });

    newData = newData.map((delivery) => {
      let newDelivery = delivery;

      garments.map((garment) => {
        let index = `garment${garment.id}`;
        if (!newDelivery[index]) {
          newDelivery[index] = 0;
        }
      });
      return newDelivery;
    });
    setFormatDataSource(newData);
  };

  useEffect(() => {
    formatAllDeliveries(dataSource);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, garments]);

  useEffect(() => {
    setLoading(true);
    getGarmentsTableParameters(true).then((res) => {
      setLoading(false);
      setGarments(res);
    });
    getAllDeliveries().then((response) => {
      setDataSource(response);
    });

    getTableParameters().then((res) => {
      setProductsList(res);
    });
    getReasonsTableParameters(true).then((res) => {
      setReasonsList(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let getColumns = garments.map((garment) => {
      return {
        title: garment.description,
        dataIndex: `garment${garment.id}`,
        editable: true
      };
    });
    setGarmentsColumns(getColumns);
  }, [garments]);

  const onCreateDelivery = () => {
    setLoading(true);
    createDelivery({...addingFile}).then(() => {
      getAllDeliveries().then((res) => {
        formatAllDeliveries(res);
        setLoading(false);
      });
    });
  };

  const onDelete = (id) => {
    setLoading(true);
    deleteUniformDelivery(id).then(() => {
      getAllDeliveries().then((response) => {
        setDataSource(response);
        setLoading(false);
      });
    });
  };

  const columns = [
    {
      key: '1',
      title: 'N°',
      dataIndex: 'id'
    },
    {
      key: '2',
      title: 'Motivo',
      dataIndex: 'reason',
      width: '10%',
      ...getColumnSearchProps('motivo'),
      sorter: (a, b) => a.reason.localeCompare(b.reason),
      sortDirections: ['descend', 'ascend']
    },
    {
      key: '3',
      title: 'Descripción',
      dataIndex: 'descripcion',
      width: '10%',
      ...getColumnSearchProps('descripcion'),
      sorter: (a, b) => a.descripcion?.localeCompare(b.descripcion),
      sortDirections: ['descend', 'ascend']
    },
    {
      key: '4',
      title: 'Prendas',
      children: [...garmentsColumns],
      dataIndex: 'prendas'
    },
    {
      key: '5',
      title: 'Reposición',
      dataIndex: 'replacementAuto',
      width: '9.5%',
      ...getColumnSearchProps('reposición'),
      sorter: (a, b) => a.replacementAuto.localeCompare(b.replacementAuto),
      sortDirections: ['descend', 'ascend'],
      render: (_) => {
        return <div>{_} días</div>;
      }
    },
    {
      key: '6',
      title: 'Cálculo',
      dataIndex: 'calculation',
      width: '10%',
      ...getColumnSearchProps('cálculo'),
      sorter: (a, b) => a.calculation.localeCompare(b.calculation),
      sortDirections: ['descend', 'ascend']
    },
    {
      key: '7',
      title: 'Cobro',
      dataIndex: 'payment',
      width: '7.5%',
      ...getColumnSearchProps('cobro'),
      sorter: (a, b) => a.payment.localeCompare(b.payment),
      sortDirections: ['descend', 'ascend'],
      render: (_) => {
        return <div>{_ ? 'SI' : 'NO'}</div>;
      }
    },
    {
      key: '8',
      title: 'Valor',
      width: '7.5%',
      dataIndex: 'price',

      ...getColumnSearchProps('valor'),
      sorter: (a, b) => a.price.localeCompare(b.price),
      sortDirections: ['descend', 'ascend'],
      render: (_) => {
        return <div>${_}</div>;
      }
    },
    {
      key: '4',
      title: 'Porcentajes',
      children: [
        {
          title: 'Empleado',
          dataIndex: 'personalDiscount',
          render: (_) => {
            return <div>{_}%</div>;
          }
        },
        {
          title: 'Empresa',
          dataIndex: 'companyDiscount',
          render: (_) => {
            return <div>{_}%</div>;
          }
        }
      ],
      dataIndex: 'prendas'
    },
    {
      title: 'Ver',
      fixed: 'right',
      dataIndex: 'accion',
      render: (_, record) => {
        return (
          <span className="flex items-center justify-center	">
            <Typography.Link
              onClick={() => {
                onDelete(record.id);
              }}
              style={{
                marginRight: 8
              }}
            >
              <DeleteFilled />
            </Typography.Link>
          </span>
        );
      }
    }
  ];

  const resetEditing = () => {
    setIsEditing(false);
    setEditingFile(null);
  };

  const resetAdd = () => {
    setIsAdd(false);
    setAddingFile(null);
  };

  const onAddFile = () => {
    setIsAdd(true);
    setDataSource(() => {
      return [...dataSource];
    });
  };

  return {
    dataSource,
    formatDataSource,
    setDataSource,
    isEditing,
    setIsEditing,
    editingFile,
    setEditingFile,
    columns,
    isAdd,
    setIsAdd,
    addingFile,
    setAddingFile,
    resetEditing,
    resetAdd,
    onAddFile,
    productsList,
    reasonsList,
    onCreateDelivery,
    onDelete,
    loading
  };
};
