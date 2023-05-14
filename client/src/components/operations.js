import '../css/operations.css';
import {
    Collapse,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import map from "../res/map.svg";
import { useContext, useEffect, useState } from "react";
import { IoClose } from 'react-icons/io5'
import { BsCheck, BsTelephone } from "react-icons/bs";
import { Appcontext } from './context';
const TableBtn = (props) => {
    var type = props.type;
    return (
        <button className={`px-2 py-3 ${type === 1 ? "text-[#095E97] bg-[#CFECFF]" : type === 0 ? "text-[#FF8A00] bg-[#FFE9CE]" : type === 2 ? "text-[#2B6877] bg-[#92E3A966]" : ""} uppercase`}>{props.type === 2 ? "COMPLETED" : props.type === 1 ? "DISPATCHED" : props.type === 0 ? "TBD" : ""}</button>
    );
};
const TableBody = (props) => {
    const [status, setStatus] = useState(props.status || 0);
    // const updateStatusFn_ = props.updateStatusFn2;
    var priority = props.priority || null;
    var onclickevent = props.onClick || "";
    const { changeID, setChangeID, changeStatus, setChangeStatus } = useContext(Appcontext);
    if (onclickevent === "") {
        onclickevent = function () { return; };
    }
    const onUpdateStatus = (id, st) => {
        if (!window.confirm("Are you sure want to update the status?")) {
            return;
        }
        setStatus(st);
        setChangeID(id);
        setChangeStatus(st);
        // updateStatusFn_(id,st);
    };
    return (
        <>
            <Tr className="hover:bg-[#f1f1f1] duration-100 cursor-pointer" onClick={onclickevent}>
                <Td>
                    <div
                        className={`uppercase ${priority === "high" ? "bg-[#FE0A0A]" : priority === "medium" ? "bg-[#FF8A00]" : priority === "low" ? "bg-green-700" : ""} text-center text-white font-semibold w-fit px-2 py-2 rounded-full`}
                    >
                        {props.priority}
                    </div>
                </Td>
                <Td>
                    <div className="flex gap-2 items-center">
                        <div className="bg-[#2B687736] text-[#2B6877] p-2 rounded-full">
                            <BsTelephone />
                        </div>
                        <div className="flex flex-col text-sm">
                            <div>{props.callerName}</div>
                            <div>{props.callerNumber}</div>
                        </div>
                    </div>
                </Td>
                <Td className="uppercase">{props.emergency}</Td>
                <Td className="uppercase">{props.time}</Td>
                <Td>{props.location}</Td>
                <Td>
                    <Menu>
                        <MenuButton>
                            <TableBtn type={status} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem
                                onClick={() => {
                                    onUpdateStatus(props._key, 0);
                                }}
                            >
                                <div className="flex gap-2 items-center justify-between w-full px-2">
                                    <TableBtn type={0}>tbd</TableBtn>
                                    {status === 0 ? <BsCheck className="text-3xl" /> : ""}
                                </div>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    onUpdateStatus(props._key, 1);
                                }}
                            >
                                <div className="flex gap-2 items-center justify-between w-full px-2">
                                    <TableBtn type={1}>Dispatched</TableBtn>
                                    {status === 1 ? (
                                        <BsCheck className="text-3xl" />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    onUpdateStatus(props._key, 2);
                                }}
                            >
                                <div className="flex gap-2 items-center justify-between w-full px-2">
                                    <TableBtn type={2}>completed</TableBtn>
                                    {status === 2 ? (
                                        <BsCheck className="text-3xl" />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Td>
            </Tr>
        </>
    );
};
const OperationsPage = (props) => {
    const [section, setSection] = useState("ongoing");
    const { isOpen, onOpen, onToggle } = useDisclosure();
    const [modalContentLoaded, setModalContentLoaded] = useState(false);
    const [mapLocation, setMapLocation] = useState(false);
    const data = props.operationsData;
    const [filteredData, setFilteredData] = useState([]);
    const [ongoingCount, setOngoingCount] = useState(0);
    const [unresolvedCount, setUnresolvedCount] = useState(0);
    const [resolvedCount, setResolvedCount] = useState(0);
    const updateStatusFn = props.updatebtn;

    useEffect(() => {
        let ongoing = 0;
        let unresolved = 0;
        let resolved = 0;

        data.forEach((item) => {
            if (item.status === 0) {
                ongoing++;
            } else if (item.status === 1) {
                unresolved++;
            } else if (item.status === 2) {
                resolved++;
            }
        });

        setOngoingCount(ongoing);
        setUnresolvedCount(unresolved);
        setResolvedCount(resolved);
    }, [data, section]);

    useEffect(() => {
        setFilteredData(
            data.filter((item) => {
                if (section === "ongoing") {
                    return item.status === 0;
                } else if (section === "unresolved") {
                    return item.status === 1;
                } else if (section === "resolved") {
                    return item.status === 2;
                }
                return true;
            })
        );
    }, [data, section]);

    function ContentLoadwID(id) {
        setModalContentLoaded(false)
        let content = data.filter((item) => {
            return item.id === id;
        });
        setModalContentLoaded(content[0].transcript);
        setMapLocation(content[0].location);
    }
    return (
        <div>
            <div className="lg:m-12 m-6 md:m-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex flex-col gap-6">
                        <div onClick={() => { setSection('ongoing') }} className={`bg-${section === "ongoing" ? '[#E9F9EE] border-black' : 'white'} border-[1px] py-3 px-16 rounded-xl hover:border-black hover:bg-[#E9F9EE] duration-200 cursor-pointer`}>
                            <div className="flex flex-col gap-3 text-center">
                                <h1 className="text-lg">Ongoing</h1>
                                <p className="text-xl font-semibold">{ongoingCount}</p>
                            </div>
                        </div>
                        <div onClick={() => { setSection('unresolved') }} className={`bg-${section === "unresolved" ? '[#E9F9EE] border-black' : 'white'} border-[1px] py-3 px-16 rounded-xl hover:border-black hover:bg-[#E9F9EE] duration-200 cursor-pointer`}>
                            <div className="flex flex-col gap-3 text-center">
                                <h1 className="text-lg">Unresolved</h1>
                                <p className="text-xl font-semibold">{unresolvedCount}</p>
                            </div>
                        </div>
                        <div onClick={() => { setSection('resolved') }} className={`bg-${section === "resolved" ? '[#E9F9EE] border-black' : 'white'} border-[1px] py-3 px-16 rounded-xl hover:border-black hover:bg-[#E9F9EE] duration-200 cursor-pointer`}>
                            <div className="flex flex-col gap-3 text-center">
                                <h1 className="text-lg">Resolved</h1>
                                <p className="text-xl font-semibold">{resolvedCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="bg-white py-4 rounded-xl">
                            <TableContainer>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Priority</Th>
                                            <Th>Caller</Th>
                                            <Th>Emergency</Th>
                                            <Th>Time</Th>
                                            <Th>Location</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredData.map((item) => (
                                            <TableBody
                                                _key={item.id}
                                                priority={item.priority}
                                                callerName={item.name}
                                                callerNumber={item.phone}
                                                emergency={item.attention}
                                                location={item.location}
                                                time={item.time}
                                                status={item.status}
                                                updateStatusFn2={updateStatusFn}
                                                onClick={() => { onOpen(); ContentLoadwID(item.id); }}
                                            />
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </div>
                        <Collapse in={isOpen} animateOpacity>
                            <div className="my-6">
                                <div className="bg-white p-4 rounded-xl">
                                    <div className="flex justify-between mr-4 items-center">
                                        <h1 className="font-semibold text-gray-600 uppercase">Transcript</h1>
                                        <IoClose className="text-2xl cursor-pointer" onClick={onToggle} />
                                    </div>
                                    {modalContentLoaded ? <p className="mt-2">{modalContentLoaded}</p> : <div className="flex justify-center items-center my-12"><Spinner /></div>}
                                </div>
                                {modalContentLoaded ? <div className="my-4 w-full">
                                    {/* <img src={map} alt="" className="h-auto w-full" /> */}
                                    {/* .gmap_canvas {overflow:hidden;background:none!important;height:510px;width:770px;} */}
                                    <div className='w-full' style={{width: "100% !important"}}><div style={{width: "100% !important"}} className="overflow-hidden  bg-none h-auto w-full"><iframe className='w-full h-[450px]' id="gmap_canvas" src={`https://maps.google.com/maps?q=${mapLocation}&t=&z=10&ie=UTF8&iwloc=&output=embed`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe><a href="https://2yu.co">2yu</a><br/><a href="https://embedgooglemap.2yu.co">html embed google map</a></div></div>
                                </div> : <></>}
                            </div>
                        </Collapse>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OperationsPage;
