import { useState, useEffect } from 'react';
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Select, InputNumber, Input } from 'antd';
import dataCity from 'data.json';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
    lg: {
      span: 24,
    },
    xl: {
      span: 24,
    },
  },
  wrapperCol: {
    xs: {
      span: 0,
    },
    sm: {
      span: 24,
    },
  },
};

export default function EditAddress({ id_card, actionPutCartAddressesAPI, token, loadingUpdateCartStatus, setVisibleEditAddress }) {
  const { TextArea } = Input;
  //create state
  const [form] = Form.useForm();
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  // function
  const onChangeCity = (City) => {
    setCity(City);
  };
  const onChangeDistrict = District => {
    setDistrict(District);
  }
  const actionChangeAddress = async (value) => {
    const { city, district, commune, incubation, numberPhone, } = value;
    const data = {
      inForCart: {
        address: `${incubation} - ${commune} - ${district} - ${city}`,
        phone: numberPhone,
      },
      id_card: id_card
    };
    const result = await actionPutCartAddressesAPI(data, token);
    const currentCart = unwrapResult(result);
    if (currentCart) {
      setVisibleEditAddress(false);
    }

  }
  // useEffect
  useEffect(() => {
    form.resetFields(['district']);
    form.resetFields(['commune']);
  }, [city]);
  useEffect(() => {
    form.resetFields(['commune']);
  }, [district]);

  return (
    <div className="group-check-out">
      <Form
        {...formItemLayout}
        form={form}
        onFinish={actionChangeAddress}
      >
        <Form.Item
          name="city"
          label="Tỉnh/Thành phố"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn tỉnh hoặc thành phố bạn ở !',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Tỉnh/Thành phố"
            optionFilterProp="children"
            onChange={onChangeCity}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              dataCity.map((city, index) => (
                <Option value={city.name} key={index}>{city.name}</Option>
              ))
            }
          </Select >
        </Form.Item>

        <Form.Item
          name="district"
          label="Quận/Huyện"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn quận hoặc huyện nơi bạn !',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Quận/Huyện"
            optionFilterProp="children"
            onChange={onChangeDistrict}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              dataCity.map((itemCity, index) => itemCity.name === city && (
                itemCity.huyen.map((huyen) => (
                  <Option value={huyen.name} key={index}>{huyen.name}</Option>
                ))
              ))
            }
          </Select >
        </Form.Item>
        <Form.Item
          name="commune"
          label="Xã/Thị Trấn"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn xã bạn ở !',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Xã/Thị Trấn"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              dataCity.map(itemCity => itemCity.name === city && (
                itemCity.huyen.map(huyen => huyen.name === district && (
                  huyen.xa.sort().map((xa, index) => (
                    <Option value={xa.name} key={index}>{xa.name}</Option>
                  ))
                ))
              ))
            }
          </Select >
        </Form.Item>
        <Form.Item
          name="incubation"
          label="Ấp/Số Nhà/Tên Đường"
          rules={[
            {
              required: true,
              message: 'Địa chỉ cụ thể !',
            }
          ]}
        >
          <TextArea
            placeholder="địa chỉ cụ thể: ấp, số nhà, tên đường..."
            maxLength={200}
            rows={4}
          />
        </Form.Item>
        <Form.Item
          name="numberPhone"
          label="Số Điện Thoại"
          className="group-phone"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập đúng số điện thoại !',
            }
          ]}
        >
          <InputNumber type="number" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loadingUpdateCartStatus}
            className="btn-register"
          >
            Cập nhật
              </Button>
        </Form.Item>
      </Form>

    </div>
  )
}