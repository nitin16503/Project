import React, { FC } from 'react';
import TablePagination from '@mui/material/TablePagination';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import './customTable.css';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface CustomHeaderProps {
    label: string;
    color: string;
    textcolor: string;
}

export const CustomHeader: FC<CustomHeaderProps> = ({ label, color, textcolor }) => {
    return (
        <Paper elevation={3} className='headingContainer' sx={{ bgcolor: color }}>
            <Typography variant="h3" className='tableHeading' sx={{ color: textcolor }}>
                {label}
            </Typography>
        </Paper>
    )
}

interface CustomTableHeaderProps {
    enableSort: boolean;
    headerColor: string;
    columns: any[];
    list: any;
    activeColumn?: string;
    sortOrder?: any;
    handleSort?: (column: string) => void;
    cellWidths?: string[]; // new prop for cell widths
}

export const CustomTableHeader: FC<CustomTableHeaderProps> = ({
    enableSort,
    headerColor,
    columns,
    list,
    activeColumn,
    sortOrder,
    handleSort,
    cellWidths = [], // default value for cellWidths is an empty array
}) => {
    return (
        <TableHead sx={{ background: headerColor }}>
            <TableRow>
                {columns.map((column: any, index: number) => (
                    <TableCell key={column.id} className='table-head-cell' style={{ width: cellWidths[index] }}>
                        {list.length > 0 && enableSort && sortOrder[column.id] ? (
                            <span onClick={() => handleSort && handleSort(column.id)}>
                                {column.label}
                                <SortButton
                                    sortOrder={sortOrder[column.id]}
                                    color={activeColumn === column.id ? '' : 'grey'}
                                />
                            </span>
                        ) : (
                            <div className="truncate">
                                {column.label}
                            </div>
                        )}
                    </TableCell>
                ))}
                <TableCell className='table-head-cell'>Action</TableCell>
            </TableRow>
        </TableHead>
    );
};

// other components remain the same

// other components remain the same


interface CustomTablePaginationProps {
    totalRows: number; // or the appropriate type for totalRows
    rowsPerPage: number; // or the appropriate type for rowsPerPage
    totalPages: number; // or the appropriate type for totalPages
    page: number; // or the appropriate type for page
    handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void; // or the appropriate type for handleChangePage
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; // or the appropriate type for handleChangeRowsPerPage
}

export const CustomTablePagination: FC<CustomTablePaginationProps> = ({
    totalRows,
    rowsPerPage,
    totalPages,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
}) => {
    return (
        <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={totalRows}
            page={page - 1} // Adjust the page index to start from 0
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    )
}

interface SortButtonProps {
    sortOrder: string,
    color?: string
}

const SortButton: FC<SortButtonProps> = ({
    sortOrder,
    color
}) => {

    return (
        <>
            {sortOrder === 'asc' ? (
                <ArrowDropDownIcon fontSize="large" style={{ color }} />
            ) : (
                <ArrowDropUpIcon fontSize="large" style={{ color }} />
            )}
        </>
    );
};