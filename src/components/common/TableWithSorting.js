import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, makeStyles, Table, TableBody,
  TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar,
  Paper, Tooltip, IconButton, Checkbox, Grid
} from '@material-ui/core';
import { lighten } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Send from '@material-ui/icons/Send';
import DoneAll from '@material-ui/icons/DoneAll';
import Edit from '@material-ui/icons/Edit';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import clsx from 'clsx';

/**  Props to send:
*
* REQUIRED @headerElements : array of objects for the headings of the table,
*                 example: 
*                    headerElements = [
*                        { 
*                            id: 'Name', // for sorting
*                            numeric: true, // for the alignment, if true: aligned right, if false: aligned left 
*                            disablePadding: false, // for padding, if true: no padding, if false: default padding 
*                            label: 'Name' // label which will be displayed
*                        },
*                        { 
*                            id: 'Age', 
*                            numeric: true, 
*                            disablePadding: false, 
*                            label: 'Age' 
*                        }
*                    ]
*
* REQUIRED @data : array of objects for the actual data, the id for each object will not be displayed
*
* OPTIONAL @action : function for each row, calls the action function with ROW ID
*
* OPTIONAL @actionName : string for the name of the action button, if null, 'ACTION' will be displayed
*
* OPTIONAL @actionColor : string for the color of the action button,
*                        only 'primary' or 'secondary' accepted,
*                        if null, the button will be of default color or 'primary' color
* 
* OPTIONAL @deleteAction : function which will be used for deleting selected rows,
*                          if null, user cannot select rows
**/

/* Example code:
*
* <TableWithSorting
*    headerElements={headCells}
*    data={data}
*    deleteAction={deleteFunction}
*    action={actionFunction}
*    actionName={'View'}
*    actionColor={'primary'}
*    /> 
*/

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  tableHeadRow: {
    marginLeft: theme.spacing(2)
  },
  specialRow: {
    backgroundColor: lighten(theme.palette.secondary.light, 0.85)
  }
}));


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];

  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    rowCount,
    onSelectAllClick,
    numSelected,
    headCells,
    options,
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow>
        {options !== undefined && (options.selector &&
                    <TableCell padding='checkbox'>
                      <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all plugs' }}
                      />
                    </TableCell>)}
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              <span className={classes.tableHeadRow}>{headCell.label}</span>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  numSelected: PropTypes.number.isRequired,
  headcells: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
        theme.palette.type === 'light'
          ? {
            color: theme.palette.primary.main,
            backgroundColor: lighten(theme.palette.primary.light, 0.85)
          }
          : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.dark
          },
  title: {
    flex: '1 1 100%'
  }
}));

const EnhancedTableToolbar = props => {
  const { numSelected, selectedIds, tableTitle, options, specialRow } = props;
  const classes = useToolbarStyles();

  // const deleteFunc = (e,data) => {
  //     deleteFunction(e,selectedIds);
  //     console.log(selectedIds);
  //     setSelected([]);
  // }
  const handleActionType = () => {
    let content =
            (options.toolbarActions.map((value, i) => {
              return (value.actionType === 'delete' ? (<Grid item key={'toolbarAction' + i}><Tooltip title='Delete'>
                <IconButton aria-label='delete' color='secondary' onClick={(e) => value.function(e, selectedIds)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              </Grid>) : (value.actionType === 'shout' ? (<Grid item key={'toolbarAction' + i}><Tooltip title='Shout'>
                <IconButton aria-label='shout' color='primary' onClick={(e) => value.function(e, selectedIds)}>
                  <Send />
                </IconButton>
              </Tooltip>
              </Grid>) : (value.actionType === 'confirm' && (<Grid item key={'toolbarAction' + i}><Tooltip title={value.actionType} >
                <IconButton aria-label={value.actionType} color='primary' onClick={(e) => value.function(e, selectedIds)}>
                  <DoneAll />
                </IconButton>
              </Tooltip></Grid>))));

            })
            );
    return content;
  };
  const checkRole = () => {
    let result = false;
    selectedIds.forEach(id => {
      if (specialRow.includes(id)) {
        result = true;
        return result;
      }
    });
    return result;
  };
  const handleEditAction = () => {
    let content =
            (options.toolbarActions.map((value, i) => {
              return (value.actionType === 'promote' ? (!checkRole() && <Grid item key={'toolbarAction' + i}><Tooltip title={value.actionType} >
                <IconButton aria-label={value.actionType} color='primary' onClick={(e) => value.function(e, selectedIds)}>
                  <ArrowUpwardIcon />
                </IconButton>
              </Tooltip></Grid>) : (value.actionType === 'demote' ? (checkRole() && <Grid item key={'toolbarAction' + i}><Tooltip title={value.actionType} >
                <IconButton aria-label={value.actionType} color='primary' onClick={(e) => value.function(e, selectedIds)}>
                  <ArrowDownwardIcon />
                </IconButton>
              </Tooltip></Grid>) : (value.actionType === 'edit' && (<Grid item key={'toolbarAction' + i}><Tooltip title={value.actionType} >
                <IconButton aria-label={value.actionType} color='primary' onClick={(e) => value.function(e, selectedIds)}>
                  <Edit />
                </IconButton>
              </Tooltip></Grid>))));
            }));
    return content;
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color='inherit' variant='subtitle1'>
          {numSelected} selected
        </Typography>
      ) : (
        <Grid container spacing={1} direction='row'>
          <Grid item className={classes.title} xs={9}>
            <Typography variant='h5' id='tableTitle'>
              {tableTitle}
            </Typography>
          </Grid>
          <Grid container item justify='flex-end' alignItems='flex-end' xs={3}>
            {options !== undefined && options.toolbarActions.map((value, i) => {
              return (value.actionType === 'add' && (<Grid item key={'toolbarAction' + i}><Tooltip title='Add' >
                <IconButton aria-label='add' color='primary' onClick={(e) => value.function(e, selectedIds)}>
                  <PersonAdd />
                </IconButton>
              </Tooltip></Grid>
              ));
            })}
          </Grid>
        </Grid>
      )}

      {numSelected > 0 ? (
        <Grid container spacing={1} direction='row' justify='flex-end' alignItems='flex-end'>
          {numSelected === 1 && (handleEditAction())}
          {handleActionType()}
        </Grid>
      ) : (
        null
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  options: PropTypes.object,
  setSelected: PropTypes.func.isRequired,
  tableTitle: PropTypes.string,
  specialRow: PropTypes.array
};

export const TableWithSorting = (props) => {
  const classes = useStyles();
  const [obj, setObj] = useState([]);

  const {
    headerElements,
    data,
    action,
    actionName,
    actionColor,
    textAlign,
    tableTitle,
    ignoreKeys,
    options,
    specialRow
  } = props;

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(headerElements[0].id);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selected, setSelected] = React.useState([]);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = obj.map(n => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const colSpanEmpty = headerElements.length;

  useEffect(() => {
    setObj(props.data);
  }, [props.headerElements, props.data]);

  return (
    <div className={classes.root} >
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selectedIds={selected}
          setSelected={setSelected}
          tableTitle={tableTitle}
          options={options}
          specialRow={specialRow}
        />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            size={'medium'}
            aria-label='enhanced table'
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              headCells={headerElements}
              options={options}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                      role='checkbox'
                      selected={isItemSelected}
                    >
                      {options !== undefined && (options.selector && (specialRow !== undefined && specialRow.includes(row._id) ? <TableCell padding='checkbox'
                        className={classes.specialRow}>
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-label': labelId }}
                          onClick={event => handleClick(event, row._id)}
                        />
                      </TableCell> : <TableCell padding='checkbox'>
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-label': labelId }}
                          onClick={event => handleClick(event, row._id)}
                        />
                      </TableCell>)
                      )}

                      {Object.keys(row).map((value, index) => {
                        return ignoreKeys.includes(value) ? null : (specialRow !== undefined && specialRow.includes(row._id) ? (<TableCell
                          align={textAlign === undefined ? 'left' : textAlign}
                          scope='row'
                          key={index}
                          className={classes.specialRow}
                        >{(Array.isArray(row[value]) ? row.join(', ') : row[value])}
                        </TableCell>) : (
                          <TableCell
                            align={textAlign === undefined ? 'left' : textAlign}
                            scope='row'
                            key={index}
                          >{(Array.isArray(row[value]) ? row.join(', ') : row[value])}
                          </TableCell>)
                        );
                      })}


                      {action === undefined || action === null ? null :
                        <TableCell align='right'>
                          <Button
                            variant='contained'
                            color={props.actionColor === undefined ||
                                                            props.actionColor === null ||
                                                            (props.actionColor !== 'primary' && props.actionColor !== 'secondary') ?
                              'primary' : actionColor
                            }
                            className={classes.buttons}
                            onClick={() => action(row._id)}
                          >{actionName === undefined || actionName === null ? 'Action' : actionName}
                          </Button>
                        </TableCell>
                      }

                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={colSpanEmpty + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page'
          }}
          nextIconButtonProps={{
            'aria-label': 'next page'
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

TableWithSorting.propTypes = {
  headerElements: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableTitle: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.arrayOf(PropTypes.object),
  actionName: PropTypes.string,
  actionColor: PropTypes.string,
  textAlign: PropTypes.string,
  options: PropTypes.object,
  ignoreKeys: PropTypes.array,
  specialRow: PropTypes.array,
};