import React from 'react';
import Router from 'next/router';
import styles from './class.module.css';

import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { RouterLoading } from '@services/routing';

import { Clsx } from '@components/core';
import { MuiLoading } from '@components/core';
import { PagePublications } from './PagePublications';
import { MuiSkeleton, MuiButton } from '@components/core';
import { MuiAutocomplete, MuiScrollbar } from '@components/core';

import { LazyImage } from 'react-lazy-images';
import { applySnapshot } from 'mobx-state-tree';
import { LocationLevels } from '@store/DataStore';

import { RouteModel } from '@pages/publications/index';
import { PagePartsFilter } from '@app/publications/modal/PagePartsFilter';
import { PublicationsPartsList } from '@models/publications/parts/PublicationsPartsList';

export const ListPublications = observer((props) => {
  const propsLocations = {};
  const router = useRouter();
  const { id, ...param } = router['query'];
  const [ loading, setLoading ] = React.useState(false);
  React.useEffect(() => RouterLoading(setLoading), [props]);
  const [ openFilter, setOpenFilter ] = React.useState(null);
  React.useEffect(() => { applySnapshot(model, {...props['model']}) }, [props]);
  const [ model ] = React.useState(PublicationsPartsList.create({...props['model']}));
  ////////////////////////////////////////////////////////////////////////////////////
  const location = LocationLevels.find(item => item['id'] === model['filter']['location']['fias_level']);
  location ? (propsLocations['from_bound'] = location['code'], propsLocations['to_bound'] = location['code']) : null;
  ////////////////////////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    openFilter == false && reloadPage();
  }, [openFilter]);

  const reloadPage = () => {
    let url = router['pathname'];
    const param = model['filter'].getFilterURL();
    url = param ? router['pathname']+'?'+param : url;
    router.push(url, undefined, { shallow: false });
  }

  return (
    <div className={'flex flex-col flex-1'}>

      <div className={'flex flex-row flex-1'}>
        <div className={'flex flex-col flex-1 relative'}>

          <MuiScrollbar className={styles['scrollbar']}>
            {model['response'].map((row, index) => {
              return (
                <div key={index} className={Clsx('flex flex-row w-[100%]', styles['grid'])}>
                  {(row || []).map((subRow, subIndex) => {
                    const { id, ...param } = router['query'];
                    const onClick = () => Router.push({pathname: router['pathname'], query: {id: subRow['id']}}, null, { shallow: true });
                    return (
                      <div key={subIndex} onClick={()=>onClick()} className={styles['row-publications']}>
                        <div className={styles['label']}>{subRow['part_category']['label']}</div>

                        <div className={'flex flex-row flex-1 items-center'}>
                          {/* ////////////// */}
                          <LazyImage
                            debounceDurationMs={300}
                            src={subRow.getPreview() ?? '/images/parts.png'}
                            placeholder={({ ref }) => (
                              <div className={styles['img']} ref={ref}>
                                <MuiSkeleton className={styles['img-skeleton']}/>
                              </div>
                            )}
                            actual={({ imageProps }) => (
                              <div className={styles['img']}>
                                <img {...imageProps} className={'animated fadeIn'}/>
                              </div>
                            )}
                          />
                          {/* ////////////// */}

                          <div className={styles['description']}>
                            <div className={styles['car']}>{subRow['car']['label']}</div>
                            <div className={styles['address']}>{'Белгород'}</div>
                            <div className={styles['price']}>{subRow.getPrice()}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}

            <div>
              <MuiButton
                label={'Загрузить еще'}
                loading={model['isFetching']}
                onClick={()=>model.loadMoreModel({})}
                className={Clsx(styles['button-load-more'], model['paginator'].isLast() ? 'invisible' : null)}
              />
            </div>
          </MuiScrollbar>

          <MuiLoading visible={(model['isFetching'] || loading)} duration={300}/>
        </div>

        <div className={'flex flex-col w-[400px] h-[100%] border-l px-4'}>

          <MuiAutocomplete
            selectOnly={true}
            optionLabel={'label'}
            disableClearable={true}
            label={'Область поиска'}
            options={LocationLevels}
            value={model['filter']['location']['fias_level']}
            component={model['filter']['location']['component']}
            onChange={(value)=>{
              const id = value['id'];
              model['filter']['location'].changeControl('fias_level', id);
              setTimeout(()=>model['filter']['location'].changeControl('suggests', []),0);         
              setTimeout(()=>applySnapshot(model['filter']['location'], {fias_level: id}),0);
            }}
          />

          <MuiAutocomplete
            optionLabel={'label'}
            label={location['label']}
            value={model['filter']['location']}
            options={model['filter']['location']['suggests']}
            component={model['filter']['location']['component']}
            onChange={(value)=>model['filter']['location'].selectControl(value, ['fias_level'])}
            onInputChange={(value)=>model['filter']['location'].setSuggests({value: value, ...propsLocations})}
          />

          {(model['filter']['parts'] || []).map((row, index) => (
            <div key={index} onClick={()=>(model['filter'].deleteParts(row), reloadPage())}>
              <div>{row['car']['label']}</div>
              <div>{row['part_category']['label']}</div>
            </div>
          ))}

          <div className={'mt-[auto]'}>
            <MuiButton
              label={'Ссылка'}
              className={'ml-[auto] mt-[10px]'}
              onClick={()=>console.log(model['filter'].getFilterURL())}
            />

            <MuiButton
              label={'Фильтр'}
              className={'ml-[auto] mt-[10px]'}
              onClick={()=>setOpenFilter(true)}
            />
          </div>

        </div>
      </div>

      <PagePublications/>
      <PagePartsFilter filter={model['filter']} open={openFilter} onClose={()=>setOpenFilter(false)}/>
    </div>  
  )
})