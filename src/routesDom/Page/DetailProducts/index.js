import { useEffect, useState, useContext } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Popconfirm } from 'antd';
import $ from 'jquery';
// API
import { getProductId, getProductType } from "features/Product/pathAPI";
import { getCommentOne } from "features/Comment/pathAPI";
import { addCartProduct } from "features/Cart/CartSlice";
import { deleteToProduct } from 'features/Admin/Product/pathAPI';
// --Components
import InForProduct from "./InForProduct";
import SeeMoreProduct from "./SeeMoreProduct/index";
import Comment from "./Comment/index";
import Loading from "loading/index";
import HistoryProduct from "./HistoryProduct/index";
import LoadingPage from "component/LoadingPage/index";
import NotFount from '../NotFount/index';
// Context
import { UserContext } from "contexts/UserContext";
// --CSS
import "./style.css";
export default function DetailProducts() {
  let historyProduct = JSON.parse(localStorage.getItem("historyProduct")) || [];
  const { key, name, _id, nsx } = useRouteMatch().params;
  const history = useHistory();
  document.querySelector("title").innerHTML = name.replace(/-/g, " ");
  const dispatch = useDispatch();
  // dispatch API
  const getProductTypeAPI = (param) => dispatch(getProductType(param));
  const actionAddToCart = cart => dispatch(addCartProduct(cart));
  const actionDeleteProduct = (id, token) => dispatch(deleteToProduct(id, token));
  // create state
  const [pageComment, setPageComment] = useState(1);
  const state = useContext(UserContext);
  const { socket } = state;
  const [user,] = state.user;
  const [token,] = state.token;
  const items = 20;
  // Data Product ID
  const loading = useSelector((state) => state.productId.loading);
  const [dataProductsId, setDataProductsId] = useState([]);
  const isAdmin = useSelector(state => state.user.isAdmin);
  // Data Product See More
  const dataProductsType = useSelector((state) => state.type.listProductSlider);
  const lengthProductsType = useSelector((state) => state.type.length);
  const loadingProductsType = useSelector((state) => state.type.loading);
  // Data Comment
  const loadingComet = useSelector((state) => state.comment.loading);
  const [lengthComment, setLengthComment] = useState(null);
  const [dataComment, setDataComment] = useState([]);
  const [checkDeleteCmt, setCheckDeleteCmt] = useState(false);
  const [sumStarRating, setSumStarRating] = useState(0);
  const [starRating, setStarRating] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [loadingDeleteProduct, setLoadingDeleteProduct] = useState(false);
  // Join room
  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", _id);
    }
  }, [socket, _id]);
  // delete reply comment
  useEffect(() => {
    if (socket) {
      socket.on("serverUserDeleteReplyComment", (msg) => {
        if (msg) {
          const { comment, id_array } = msg;
          const newReply = [...dataComment];
          const index = newReply.findIndex(comment => comment._id === id_array);
          if (index !== -1) {
            newReply[index] = comment;
          }
          setCheckDeleteCmt(false);
          setDataComment(newReply);
        }
      });
      return () => socket.off("serverUserDeleteReplyComment");
    }
  }, [socket, dataComment]);
  // crete reply comment
  useEffect(() => {
    if (socket) {
      socket.on("ServerUserCreateCommentReply", (msg) => {
        if (msg) {
          const newReply = [...dataComment];
          const index = newReply.findIndex(comment => comment._id === msg._id);
          if (index !== -1) {
            newReply[index] = msg;
          }
          setDataComment(newReply);
        }
      });
      return () => socket.off("ServerUserCreateCommentReply");
    }
  }, [socket, dataComment]);
  // update reply comment
  useEffect(() => {
    if (socket) {
      socket.on("serverUserUpdateReplyComment", (msg) => {
        if (msg) {
          const newReply = [...dataComment];
          const index = newReply.findIndex(comment => comment._id === msg._id);
          if (index !== -1) {
            newReply[index] = msg;
          }
          setDataComment(newReply);
        }
      });
      return () => socket.off("serverUserUpdateReplyComment");
    }
  }, [socket, dataComment]);
  // create Comment Socket
  useEffect(() => {
    if (socket) {
      socket.on("ServerUserCreateComment", (msg) => {
        document.getElementById('waitWriteComment').innerHTML = "";
        const { comment, length, product, starRating, sumStarRating, reviewRating } = msg;
        if (msg) {
          setStarRating(starRating);
          setSumStarRating(sumStarRating);
          setReviewRating(reviewRating);
          setLengthComment(length);
          setDataComment([comment, ...dataComment]);
          setCheckDeleteCmt(false);
          setDataProductsId(product);
        }
      });
      return () => socket.off("ServerUserCreateComment");
    }
  }, [socket, dataComment]);
  // delete Comment Socket
  useEffect(() => {
    if (socket) {
      socket.on("serverUserDeleteComment", (msg) => {
        const { comment, length, product, starRating, sumStarRating, reviewRating } = msg;
        if (msg) {
          const dataCommentNew = [...dataComment];
          const index = dataCommentNew.findIndex((cmt) => cmt._id === comment._id);
          dataCommentNew.splice(index, 1);
          setLengthComment(length);
          setDataComment(dataCommentNew);
          setCheckDeleteCmt(false);
          setDataProductsId(product);
          setStarRating(starRating);
          setSumStarRating(sumStarRating);
          setReviewRating(reviewRating);
        }
      });
      return () => socket.off("serverUserDeleteComment");
    }
  }, [socket, dataComment]);
  // up date comment
  useEffect(() => {
    if (socket) {
      socket.on("serverUserUpdateComment", (msg) => {
        const { comment, product, starRating, sumStarRating, reviewRating } = msg;
        if (msg) {
          const dataCommentNew = [...dataComment];
          const index = dataCommentNew.findIndex((cmt) => cmt._id === comment._id);
          if (index !== -1) {
            dataCommentNew[index] = comment;
          }
          setDataComment(dataCommentNew);
          setDataProductsId(product);
          setStarRating(starRating);
          setSumStarRating(sumStarRating);
          setReviewRating(reviewRating);
        }
      });
    }
    return () => socket.off("serverUserUpdateComment");
  }, [socket, dataComment]);
  // get comment
  useEffect(() => {
    const fetchComment = async () => {
      const paramsComment = {
        _id_product: _id,
        page: pageComment,
        limit: 5,
      };
      const resultComment = await dispatch(getCommentOne(paramsComment));
      const comment = unwrapResult(resultComment);
      if (comment) {
        setDataComment(comment.data);
        setLengthComment(comment.length);
        setStarRating(comment.starRating);
        setSumStarRating(comment.sumStarRating);
        setReviewRating(comment.reviewRating);
      }
    };
    fetchComment();
  }, [pageComment, _id]);
  //  get one product
  useEffect(() => {
    const fetchProductIdAPI = async () => {
      const paramsType = {
        name: key,
        page: 1,
        sort_price: 0,
      };
      // fetch API Product See More
      const resultProduct = await dispatch(getProductId(_id));
      dispatch(getProductType(paramsType));
      const currentProduct = unwrapResult(resultProduct);
      setDataProductsId(currentProduct.data);
    };
    fetchProductIdAPI();
    const historyProductOld = [...historyProduct];
    historyProductOld.forEach((product, index) => {
      if (product === null || product._id === _id) {
        historyProductOld.splice(index, 1);
      }
    });
    historyProductOld.unshift(dataProductsId[0]);
    localStorage.setItem("historyProduct", JSON.stringify(historyProductOld));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [_id, key]);
  // onClick
  const onChangePage = (_page) => {
    const param = {
      items: items,
      name: key,
      page: _page,
      sort_price: 0,
    };
    getProductTypeAPI(param);
  };
  const onChangePageComment = (_page) => {
    setPageComment(pageComment + _page);
  };
  const actionCheckDeleteCmt = () => {
    setCheckDeleteCmt(true);
  };
  const onDeleteProduct = async (id) => {
    try {
      if (id) {
        setLoadingDeleteProduct(true)
        let result = await actionDeleteProduct(id, token);
        let reqDelete = unwrapResult(result);
        if (reqDelete) {
          setLoadingDeleteProduct(false);
          history.push('/');
        }
      }
    }
    catch (error) {
      setLoadingDeleteProduct(false);
      history.push('/');
    }
  };
  return (
    <>
      {/* t???i trang khi v?? s???n ph???m or thay ?????i s???n ph???m ???? */}
      {loading && <Loading />}
      {/* x??a b??nh lu???n s??? show loading */}
      {checkDeleteCmt && <LoadingPage />}
      {/* loading khi admin x??a s???n ph???m ???? */}
      {loadingDeleteProduct && <LoadingPage />}
      {
        // ki???m tra s???n ph???m c?? hay kh??ng
        dataProductsId.length > 0 ?
          <div className="container-detail-products">
            <div className="group-detail">
              {/* link ngu???n s???n ph???m */}
              <div className="link-group">
                <Link to="/">Trang ch???</Link>
                <Link to={`/product/${key}`}>{key}</Link>
                <Link to={`/products/${key}/${nsx}`}>{nsx.replace(/-/g, " ")}</Link>
                <span style={{ color: "#ec1839", fontWeight: '550' }}>{name.replace(/-/g, " ")}</span>
              </div>
              {/* hi???n ch???nh s???a v?? x??a n???u n?? l??  admin */}
              {
                isAdmin && token && <div className="ground-btn-admin">
                  <Popconfirm
                    title="Ch???c ch???n ????? x??a ?"
                    onConfirm={() => onDeleteProduct(_id)}
                    okText="C??"
                    cancelText="Kh??ng"
                    placement="bottom"
                  >
                    <Button type="primary" danger Popconfirm>
                      X??a
                  </Button>
                  </Popconfirm>
                  <Button type="primary">
                    <Link to={`/admin-edit-product/${_id}`}> Ch???nh S???a</Link>
                  </Button>
                </div>
              }
              {/* hi???n th??ng tin v??? s???n ph???m */}
              <InForProduct dataProductsId={dataProductsId} actionAddToCart={actionAddToCart} />
              {/* show t???t c??? b??nh lu???n v?? from vi???t b??nh lu???n */}
              <Comment
                idProduct={_id}
                lengthComment={lengthComment}
                dataComment={dataComment}
                onChangePageComment={onChangePageComment}
                loadingComet={loadingComet}
                socket={socket}
                token={token}
                user={user}
                actionCheckDeleteCmt={actionCheckDeleteCmt}
                sumStarRating={sumStarRating}
                starRating={starRating}
                nameProduct={name}
                reviewRating={reviewRating}
              />
              {/* s???n ph???m ????? xu???t */}
              <SeeMoreProduct
                items={items}
                data={dataProductsType}
                onChangePage={onChangePage}
                lengthProductsType={lengthProductsType}
                loading={loadingProductsType}
              />
              {/* hi???n c??c s???n ph???m ???? xem */}
              <HistoryProduct historyProduct={historyProduct} _id={_id} />
            </div>
          </div>
          // n???u s???n ph???m kh??ng c?? s??? hi???n trang r???ng
          : <NotFount />
      }
    </>
  );
};
