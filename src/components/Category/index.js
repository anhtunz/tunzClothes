import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import List from '@mui/material/List';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Slider from '@mui/material/Slider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CardMedia from '@mui/material/CardMedia';
import { useParams } from 'react-router-dom';
import { getAllCatergory, getAllChildCategory, getAllProductsByCategoryID, getCategoryDetailData } from '../../APi';
import ClothesList from '../home/ListClothes/List_Clothes';
import { useNavigate } from 'react-router-dom';


const logoStyle = {
    width: '140px',
    height: '56px',
    marginLeft: '-4px',
    marginRight: '-8px',
};


export default function CategoryPage() {
    const params = useParams();
    const [open, setOpen] = React.useState(false);
    const [menOpen, setMenOpen] = React.useState(false);
    const [priceOpen, setPriceOpen] = React.useState(true);
    const [products, setProducts] = React.useState([]);
    const [categoryDetail, setCategoryDetail] = React.useState({});
    
    React.useEffect(() => {
        const fetchData = async () => {
            const categoryData = await getAllProductsByCategoryID(params.categoryID);
            const categoryDetailData = await getCategoryDetailData(params.categoryID);
            setProducts(categoryData);
            setCategoryDetail(categoryDetailData)
        };
        fetchData();
    }, [params.categoryID],products)


    const handleClick = () => {
        setOpen(!open);
    };
    const handleMenClick = () => {
        setMenOpen(!menOpen);
    };
    const handlePriceClick = () => {
        setPriceOpen(!priceOpen);
    };

    const marks = [
        {
            value: 0,
            label: '0đ',
        },
        {
            value: 1000000,
            label: '1,000,000đ',
        },
    ];

    function valuetext(value) {
        return `${value}đ`;
    }

    const minDistance = 10;

    const [value1, setValue1] = React.useState([0, 1000000]);

    const handleChange1 = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
        } else {
            setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
        }

        const [minPrice, maxPrice] = value1;
        
        const filteredProducts = products.filter(product => {
            const salePrice = parseInt(
                (product.pr_price - (product.pr_price * product.pr_sale) / 100)
            )
            console.log(salePrice);
            console.log(parseInt(minPrice / 1000));
            console.log(parseInt(maxPrice / 1000));
            return salePrice >= parseInt(minPrice/1000) && salePrice <= parseInt(maxPrice/1000);
        });

        // filteredProducts.sort((a, b) => a.pr_price - b.pr_price);
        
        console.log(filteredProducts.length);
    };



    const [category, setCategory] = React.useState('Sản phẩm nổi bật');

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        const softProduct = [...products];
        softProduct.sort((a, b) => {
            const aLowerCaseName = a.pr_name.toLowerCase();
            const bLowerCaseName = b.pr_name.toLowerCase();
            const aSalePrice = parseInt(
                (a.pr_price - (a.pr_price * a.pr_sale) / 100)
            )
            const bSalePrice = parseInt(
                (b.pr_price - (b.pr_price * b.pr_sale) / 100)
            )

            if (event.target.value === "az") {
                return aLowerCaseName > bLowerCaseName
                    ? 1
                    : aLowerCaseName === bLowerCaseName
                        ? 0
                        : -1;
            } else if (event.target.value === "za") {
                return aLowerCaseName < bLowerCaseName
                    ? 1
                    : aLowerCaseName === bLowerCaseName
                        ? 0
                        : -1;
            } else if (event.target.value === "lowHigh") {
                return aSalePrice < bSalePrice
                    ? -1
                    : aSalePrice === bSalePrice
                        ? 0
                        : 1;
                
            } else if (event.target.value === "highLow") {
                return aSalePrice < bSalePrice
                    ? 1
                    : aSalePrice === bSalePrice
                        ? 0 : -1;
            }
        })
        setProducts(softProduct)
    };


    const [clickChatBox, setClickChatBox] = React.useState(false);


    const hanndleChatBox = () => {
        setClickChatBox(!clickChatBox)
    }
    const Chatbox = () => (
        <Collapse
            in={clickChatBox}
            timeout="auto"
            unmountOnExit
        >
            <Box
                height={300}
                width={250}
                position='fixed'
                bottom={140}
                right={40}
                borderRadius={3}
            >
                <Card sx={{ maxWidth: 350, height: "100%" }}>
                    <CardHeader
                        sx={{
                            height: 50,
                        }}
                        avatar={
                            <Avatar
                                src='https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/373318937_1055633735434248_7085612218798261286_n.jpg?stp=c66.0.320.320a_dst-jpg_p320x320&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHLhiTOJ4xkj6n73g-4s36BPNrBnWxik2s82sGdbGKTa6gSNfI1CRgzqPg-YohAQj_8oqoLYqGqgnv8c7A7L7PP&_nc_ohc=bVBm4e3OvWUAX8pnxDM&_nc_ht=scontent.fhan2-4.fna&oh=00_AfD6knI9mXB0Zp7Xmu0sQr81m79hv9pbObsJHhHUNwYwGg&oe=660400F9'
                                sx={{ bgcolor: 'red' }}
                                aria-label="recipe">

                            </Avatar>
                        }
                        action={
                            <IconButton
                                sx={{
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={hanndleChatBox}
                                aria-label="settings"
                            >
                                <RemoveOutlinedIcon />
                            </IconButton>
                        }
                    />
                    <Divider />
                    <CardContent sx={{
                        height: 200,
                        maxHeight: 200
                    }}>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>
                    <CardActions
                        sx={{
                            maxHeight: 50,
                        }}
                    >
                        <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            variant="standard"
                            size="small"
                        />
                        <IconButton>
                            <SendIcon />
                        </IconButton>
                    </CardActions>
                </Card>
            </Box>
        </Collapse>

    )

    const navigate = useNavigate();
    const onClickItem = (item) => {
        navigate(`/collection/${item}`, { state: { key: `${item}` } })
    }

    const [categories, setCategories] = React.useState([])
    const [categoriesDetail, setCategoriesDetail] = React.useState([])
    React.useEffect(() => {
        const fetchData = async () => {
            const categoryData = await getAllCatergory();
            setCategories(categoryData)
            const details = [];
            for (const categoryItem of categoryData) {
                const childValues = await getAllChildCategory(categoryItem.id);
                details.push({
                    categoryId: categoryItem.id,
                    details: childValues
                });
            }
            setCategoriesDetail(details)
        };
        fetchData();
    }, []);
    return (
        <>
            <CssBaseline />
            <Grid container sx={{ height: { xs: '100%', sm: '100dvh' } }}>
                <Grid
                    item
                    xs={12}
                    sm={5}
                    lg={4}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        borderRight: { sm: 'none', md: '1px solid' },
                        borderColor: { sm: 'none', md: 'divider' },
                        alignItems: 'start',
                        pt: 4,
                        px: 5,
                        gap: 4,
                    }}
                >
                    <Box>
                        <Typography component="div" variant="h5">
                            Bộ lọc
                        </Typography>
                        <ListItemButton onClick={handleClick}>
                            <ListItemText
                                primary="Danh mục sản phẩm"
                                sx={{
                                    display: "flex",
                                    marginRight: "20px"
                                }}
                            />
                            {open ? <ExpandMore /> : <ChevronRightIcon />}
                        </ListItemButton>
                        <Collapse
                            in={open}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List component="div" disablePadding>
                                <ListItemButton sx={{
                                    pl: 4,
                                }}>
                                    <ListItemIcon>
                                        <AddIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Sale" />

                                </ListItemButton>
                                {categories.map((categoryItem) => (
                                    <React.Fragment key={categoryItem.id}>
                                        <ListItemButton
                                            sx={{ pl: 4 }}
                                            onClick={handleMenClick}
                                        >
                                            <ListItemIcon>
                                                <AddIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={categoryItem.category_name}
                                                sx={{ display: "flex", marginRight: "10px" }}
                                            />
                                            {menOpen ? <ExpandMore /> : <ChevronRightIcon />}
                                        </ListItemButton>
                                        <Collapse in={menOpen} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {categoriesDetail
                                                    .filter((item) => item.categoryId === categoryItem.id)
                                                    .map((detailItem) => (
                                                        detailItem.details.map((detail, index) => (
                                                            <ListItemButton
                                                                onClick={() => onClickItem(detail.id)}
                                                                key={detail.id}
                                                                sx={{ pl: 8 }}
                                                            >
                                                                <ListItemIcon>
                                                                    <ArrowRightRoundedIcon />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={detail.detail_name}
                                                                />
                                                            </ListItemButton>
                                                        ))
                                                    ))}
                                            </List>
                                        </Collapse>
                                    </React.Fragment>
                                ))}
                            </List>
                        </Collapse>
                        <ListItemButton
                            sx={{
                                mb: 5
                            }}
                            onClick={handlePriceClick}>
                            <ListItemText
                                primary="Khoảng giá"
                                sx={{
                                    display: "flex",
                                    marginRight: "20px",
                                }}
                            />
                            {priceOpen ? <ExpandMore /> : <ChevronRightIcon />}
                        </ListItemButton>
                        <Collapse
                            in={priceOpen}
                            timeout="auto"
                            unmountOnExit
                            sx={{
                                pl: 4
                            }}
                        >
                            <Slider
                                value={value1}
                                onChange={handleChange1}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                disableSwap
                                marks={marks}
                                min={0}
                                max={1000000}
                            />
                        </Collapse>
                    </Box>
                </Grid>
                <Grid
                    item
                    sm={12}
                    md={7}
                    lg={8}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '100%',
                        width: '100%',
                        alignItems: 'start',
                        pt: { xs: 2, sm: 2 },
                        px: { xs: 2, sm: 2 },
                        gap: { xs: 4, md: 8 },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: { sm: 'space-between', md: 'flex-end' },
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: { sm: '100%', md: '100%' },
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                flexGrow: 1,
                            }}
                        >
                            <Typography
                                style={{
                                    fontWeight: "bold"
                                }}
                            >{categoryDetail.detail_name}</Typography>
                            <Typography
                                sx={{
                                    ml:3
                                }}
                            >Số lượng: {products.length}</Typography>
                        </Box>
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-start',
                                flexGrow: 1,
                            }}
                        >
                            <Typography
                                sx={{
                                    p: 3
                                }}
                            >Sắp xếp theo: </Typography>
                            <FormControl sx={{ m: 1, minWidth: 200 }}>
                                <InputLabel id="demo-simple-select-helper-label">Sắp xếp</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={category}
                                    label="Age"
                                    onChange={handleCategoryChange}
                                >
                                    <MenuItem value="Sản phẩm nổi bật">
                                        <em>Sản phẩm nổi bật</em>
                                    </MenuItem>
                                    <MenuItem value={'lowHigh'}>Giá: Tăng Dần</MenuItem>
                                    <MenuItem value={'highLow'}>Giá: Giảm Dần</MenuItem>
                                    <MenuItem value={'az'}>Tên: A - Z</MenuItem>
                                    <MenuItem value={'za'}>Tên: Z - A</MenuItem>
                                </Select>
                            </FormControl>

                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            // background: 'red',
                            xs: 12, sm: 6, md: 4, lg: 3,
                            width: '100%',
                            flexGrow: 1
                        }}
                    >
                        <Box sx={{ flexGrow: 1, p: 2 }}>
                            <Grid
                                container
                                spacing={1}
                                sx={{
                                    xs: 12, sm: 6, md: 4, lg: 3
                                }}
                            >
                                <ClothesList
                                    title={""}
                                    products={products}
                                />

                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Box
                position='fixed'
                bottom={80}
                right={80}
                width={50}
                height={50}
                onClick={hanndleChatBox}
            >
                <Fab
                    variant="extended"
                    size="medium"
                    color="primary"
                    onClick={hanndleChatBox}
                >
                    <ChatBubbleOutlinedIcon sx={{ mr: 1 }} />
                    Chat
                </Fab>
            </Box>
            <Chatbox />
        </>
    );
}