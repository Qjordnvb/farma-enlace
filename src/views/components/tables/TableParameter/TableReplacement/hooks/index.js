import {useEffect, useState} from 'react';
import {Form, Input, InputNumber, Popconfirm, Typography} from 'antd';
import {useUtils} from 'hooks';
import BtnEdit from '../../../../../../assets/img/btn-edit.png';

export const useCustomReplacement = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [addingFile, setAddingFile] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [editId, setEditId] = useState();
  const {getColumnSearchProps, getAllRepositionParameters, editRepositionParameter} = useUtils();
  const [editingKey, setEditingKey] = useState(null);
  const [form] = Form.useForm();
  const isEditing = (record) => record?.id === editingKey;

  const [dataSource, setDataSource] = useState([
    {
      id: 1,
      n: '1',
      codigo: '115105',
      descripcion: 'ZP PRV KIT ECO HOMBRE T-M-38',
      talla: 'M',
      genero: 'HOMBRE',
      porcentaje: '30%',
      replacement: '10 días',
      sugeridoMinimo: '10',
      sugeridoMaximo: '20',
      ultimaM: 'jjarrin',
      fechaM: '10/10/2020'
    },
    {
      id: 2,
      n: '2',
      codigo: '115105',
      descripcion: 'ZP PRV KIT ECO HOMBRE T-M-38',
      talla: 'M',
      genero: 'HOMBRE',
      porcentaje: '30%',
      replacement: '15 días',
      sugeridoMinimo: '10',
      sugeridoMaximo: '20',
      ultimaM: 'jjalvarez',
      fechaM: '10/10/2020'
    }
  ]);

  useEffect(() => {
    getAllRepositionParameters().then((res) => {
      setDataSource(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const EditableCell = ({editing, dataIndex, title, inputType, children, ...restProps}) => {
    const inputNode = inputType === 'garments' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0
            }}
            rules={[
              {
                required: true,
                message: `Please enter input ${title}!`
              }
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const edit = (record) => {
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();

      const {porcentaje, reposicion} = row;
      editRepositionParameter({porcentaje, reposicion, id: key}).then(() => {
        getAllRepositionParameters().then((res) => {
          setDataSource(res);
          setEditingKey(null);
          isEditing(null);
        });
      });
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      key: '0',
      title: 'N°',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'ascend'
    },
    {
      key: '1',
      title: 'Código bodega',
      dataIndex: 'codigo',
      ...getColumnSearchProps('codigo'),
      sorter: (a, b) => a.codigo.length - b.codigo.length,
      sortDirections: ['descend', 'ascend']
    },
    {
      key: '2',
      title: 'Descripción',
      dataIndex: 'descripcion',
      ...getColumnSearchProps('descripcion'),
      sorter: (a, b) => a.descripcion.length - b.descripcion.length,
      sortDirections: ['descend', 'ascend']
    },
    {
      key: '3',
      title: 'Talla',
      dataIndex: 'talla',
      ...getColumnSearchProps('talla'),
      sorter: (a, b) => a.talla.length - b.talla.length,
      sortDirections: ['descend', 'ascend']
    },
    {
      key: '4',
      title: 'Genero',
      dataIndex: 'genero',
      ...getColumnSearchProps('genero'),
      sorter: (a, b) => a.genero.length - b.genero.length,
      sortDirections: ['descend', 'ascend']
    },
    {
      key: '5',
      title: 'Porcentajes',
      dataIndex: 'porcentaje',
      ...getColumnSearchProps('porcentaje'),
      sorter: (a, b) => a.porcentaje.length - b.porcentaje.length,
      sortDirections: ['descend', 'ascend'],
      editable: true
    },
    {
      key: '6',
      title: 'Reposición',
      dataIndex: 'reposicion',
      ...getColumnSearchProps('reposicion'),
      sorter: (a, b) => a.reposicion.length - b.reposicion.length,
      sortDirections: ['descend', 'ascend'],
      editable: true
    },
    {
      key: '7',
      title: 'Sugerido mínimo',
      dataIndex: 'totalAverage',
      ...getColumnSearchProps('totalAverage'),
      sorter: (a, b) => a.totalAverage - b.totalAverage,
      sortDirections: ['descend', 'ascend']
    },
    {
      key: '8',
      title: 'Sugerido máximo',
      dataIndex: 'max',
      ...getColumnSearchProps('max'),
      sorter: (a, b) => a.max - b.max,
      sortDirections: ['descend', 'ascend']
    },
    {
      key: '9',
      title: 'Última modificación',
      dataIndex: 'ultimaActualizacion',
      ...getColumnSearchProps('ultimaActualizacion'),
      sorter: (a, b) => a.ultimaActualizacion.length - b.ultimaActualizacion.length,
      sortDirections: ['descend', 'ascend']
    },
    {
      key: '10',
      title: 'Fecha de modificación',
      dataIndex: 'updatedAt',
      ...getColumnSearchProps('fechaM'),
      sorter: (a, b) => a.updatedAt.length - b.updatedAt.length,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Acción',
      fixed: 'right',
      dataIndex: 'accion',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginRight: 8
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div disabled={editingKey !== ''} onClick={() => edit(record)} className="btn-edit">
            <img src={BtnEdit} alt="btn-edit" />
          </div>
        );
      }
    }
  ];

  const resetEditing = () => {
    //setIsEditing(false);
    setEditingFile(null);
    setEditId(null);
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

  const onEditReplacement = async () => {
    editRepositionParameter({...editingFile, id: editId}).then(() => {
      getAllRepositionParameters().then((res) => {
        setDataSource(res);
      });
    });
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'reposicion' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return {
    dataSource,
    setDataSource,
    isEditing,
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
    onEditReplacement,
    EditableCell,
    mergedColumns,
    form
  };
};
