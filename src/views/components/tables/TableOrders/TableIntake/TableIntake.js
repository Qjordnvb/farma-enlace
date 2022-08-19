import React from 'react';
import {Table, Form, Modal, Select} from 'antd';
import {CSVLink} from 'react-csv';
import Button from 'views/components/button/Button';
import btnNew from '../../../../../assets/img/btn-new.svg';
import btnDownload from '../../../../../assets/img/btn-order.svg';

import {useCustomIntake} from './hooks';
import './style.css';
import '../../TableParameter/TableReasons/style-reasons.css';

const TableIntake = () => {
  const {
    dataSource,
    columns,
    rowSelection,
    isAdd,
    onAddFile,
    onAddOrder,
    resetAdd,
    addingFile,
    setAddingFile,
    employeesList,
    productsList
  } = useCustomIntake();

  // eslint-disable-next-line no-console
  return (
    <div className="container-table pt-16">
      <Table
        scroll={{x: 2500, y: 300}}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 3
        }}
      />
      {isAdd && (
        <>
          <Modal
            id="modal-add-orders-intake"
            className="modal-add-intake"
            title="Nueva Prenda"
            visible={isAdd}
            okText="AÑADIR"
            onCancel={() => {
              resetAdd();
            }}
            onOk={() => {
              onAddOrder();
            }}
          >
            <Form id="modalAdd" className="w-full">
              <div className="flex flex-col justify-around">
                <Form.Item className="item-form" label="Colaboradores">
                  <Select
                    placeholder={'Colaboradores'}
                    value={addingFile?.colaborador}
                    onChange={(e) => {
                      setAddingFile({
                        ...addingFile,
                        colaborador: e
                      });
                    }}
                    className="input-add"
                    showSearch
                    filterOption={(input, option) => {
                      return option.children.toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {employeesList.map((employee) => {
                      return (
                        <Select.Option key={employee.id} value={employee.id}>
                          {employee.COLABORADOR}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item className="item-form" label="Descripcion">
                  <Select
                    placeholder={'Descripcion'}
                    value={addingFile?.descripcion}
                    onChange={(e) => {
                      setAddingFile({
                        ...addingFile,
                        descripcion: e
                      });
                    }}
                    className="input-add"
                    showSearch
                    filterOption={(input, option) => {
                      return option.children.toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {productsList.map((product) => {
                      return (
                        <Select.Option key={product.id} value={product.id}>
                          {product.descripcion}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
            </Form>
          </Modal>
        </>
      )}
      <div className="flex justify-end items-end flex-col mt-10">
        <Button onClick={onAddFile} className="rounded-lg my-1 mr-2">
          <img src={btnNew} alt="new" width="220px" height="50px" />
        </Button>
        <CSVLink filename={'TableOrderIntake.xlsx'} data={dataSource} className="pt-2">
          <img
            className="btn-download"
            src={btnDownload}
            alt="btnDownload"
            width="290px"
            height="40px"
          />
        </CSVLink>
      </div>
    </div>
  );
};

export default TableIntake;
