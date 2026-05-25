import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import * as action from '../Action/AdsSetting/AdsSetting_Action';
import Loader from "./Loader";
import { useAuth } from "../context/Context";

const AdsSetting = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const hasFetched = useRef(null);
    const { loading } = useSelector(state => state.GetAdsPLatformListReducer);
    const [data, setData] = useState([]);

    useEffect(() => {
        if(hasFetched.current) return;
        hasFetched.current = true;

        const getData = () => {
            dispatch(action.getAdsPLatformList()).then((action) => {
                setData(action.responseDetails);
            });
        }

        getData();
    }, [dispatch]);
    const handleToggle = (id, status) => {
        const isAccessAllowed = user?.login_type !== 'Guest';

        if (!isAccessAllowed) {
            toast.error("Opps! You don't have Permission.");
            return false;
        }
        
        let requestData = {
            id: id,
            status: status === 1 ? "0" : 1
        }
        dispatch(action.updateAdsPLatformStatus(requestData)).then((response) => {
            toast.success(response.responseMessage);
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === id ? { ...item, status: requestData.status } : item
                )
            );
        }).catch(error => {
            toast.error(error.responseMessage);
        })
    }
    return (
        <>
            { loading ? <Loader /> : 
                <>
                    <section>
                        <div className="row">
                            {data.map((item, index) => (
                                <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6" key={`playform_${item.id}`}>
                                    <div className="card m-b-20 p-3 ads_block_card">
                                        <div className="ads_logo_item">
                                            <img className="card-img-top thumb-lg img-fluid" src={item.ad_platform_image} alt={item.ad_platform_name}/>
                                        </div>
                                        <div className="card-body p-0">
                                            <h4 className="card-title mb-4">{item.ad_platform_name}</h4>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <Link to={"/ads-setting/"+ item.id} className="btn waves-effect waves-light btn-success m-r-5" data-toggle="tooltip" title="" data-original-title="Edit"> <i className="fa fa-edit"></i> Edit </Link>
                                                <div className="checkbox-slider d-flex align-items-center">
                                                    <label>
                                                        <input type="checkbox" className="d-none hideContent is_admon" checked={parseInt(item.status) === 1} onChange={() => handleToggle(item.id, item.status)}/>
                                                        <span className="toggle_background">
                                                            <div className="circle-icon"></div>
                                                            <div className="vertical_line"></div>
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            }
        </>
    );
};

export default AdsSetting;
