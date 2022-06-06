import { AreaChartOutlined,ScheduleOutlined,WalletOutlined,ShoppingCartOutlined,ApartmentOutlined,AlertTwoTone, CompassTwoTone, CrownTwoTone, DiffTwoTone, EditTwoTone, FireTwoTone, FolderTwoTone, HomeTwoTone, LayoutTwoTone, PictureTwoTone, PieChartTwoTone, QuestionCircleTwoTone, ShoppingTwoTone, SwitcherTwoTone, UnlockTwoTone, WarningTwoTone } from '@ant-design/icons';

export default [
    {
        path: "/",
        name: "Dashboard",
        icon: <AreaChartOutlined style={{ fontSize: '16px' }} />
    },
    {
        path: "/genealogy",
        name: "Genealogy",
        icon: <ApartmentOutlined style={{ fontSize: '16px' }} />
    },
    {
        path: "/product",
        name: "Produk",
        icon: <ShoppingCartOutlined style={{ fontSize: '16px' }} />
    },
    {
        path: "/withdraw",
        name: "Penarikan",
        icon: <WalletOutlined style={{ fontSize: '16px' }} />
    },
    {
        name: "Report",
        icon: <ScheduleOutlined style={{ fontSize: '16px' }} />,
        children: [
            {
                path: "/report/withdraw",
                name: "Penarikan"
            },
            {
                path: "/report/transaction",
                name: "Transaksi"
            },
            {
                path: "/report/purchase",
                name: "Pembelian"
            }
        ]
    }
];
