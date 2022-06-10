import { HomeOutlined,AreaChartOutlined,ScheduleOutlined,WalletOutlined,ShoppingCartOutlined,ApartmentOutlined,AlertTwoTone, CompassTwoTone, CrownTwoTone, DiffTwoTone, EditTwoTone, FireTwoTone, FolderTwoTone, HomeTwoTone, LayoutTwoTone, PictureTwoTone, PieChartTwoTone, QuestionCircleTwoTone, ShoppingTwoTone, SwitcherTwoTone, UnlockTwoTone, WarningTwoTone } from '@ant-design/icons';
import {StringLink} from "../helper/string_link_helper";

export default [
    {
        path: StringLink.dashboard,
        name: "Dashboard",
        icon: <AreaChartOutlined style={{ fontSize: '16px' }} />
    },
    {
        path: StringLink.tambahMitra,
        name: "Tambah Mitra",
        icon: <HomeOutlined style={{ fontSize: '16px' }} />
    },
    {
        path: StringLink.address,
        name: "Alamat",
        icon: <HomeOutlined style={{ fontSize: '16px' }} />
    },
    {
        path: StringLink.genealogy,
        name: "Genealogy",
        icon: <ApartmentOutlined style={{ fontSize: '16px' }} />
    },
    {
        path: StringLink.product,
        name: "Produk",
        icon: <ShoppingCartOutlined style={{ fontSize: '16px' }} />
    },
    {
        path: StringLink.withdraw,
        name: "Penarikan",
        icon: <WalletOutlined style={{ fontSize: '16px' }} />
    },
    {
        name: "Report",
        icon: <ScheduleOutlined style={{ fontSize: '16px' }} />,
        children: [
            {
                path: StringLink.reportWithdraw,
                name: "Penarikan"
            },
            {
                path: StringLink.reportTransaction,
                name: "Transaksi"
            },
            {
                path: StringLink.reportPurchase,
                name: "Pembelian"
            }
        ]
    }
];
