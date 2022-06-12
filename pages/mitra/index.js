import { PageHeader } from 'antd';
import CreateMitra from '../../components/mitra/CreateMitra';
import Router from 'next/router';

const IndexMitra = ()=>{
    return <PageHeader
        className="site-page-header"
        onBack={() => Router.back()}
        title="Mitra Baru"
    >
        <CreateMitra />
    </PageHeader>
};

export default IndexMitra;
