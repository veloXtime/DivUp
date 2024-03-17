import React, { useState, useEffect, ChangeEventHandler, useRef } from "react";
import { Theme, styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Checkbox,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,

} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { formatTo2Decimal } from "./utility";

const Colors = [
    "#e57373",
    "#9fa8da",
    "#ffe082",
    "#aed581",
    "#e91e63",
    "#2196f3",
    "#4caf50",
    "#ffc107",
];

const TaxCell = styled(TableCell)({
    width: "10%",
    textAlign: 'right'
})

const AmountCell = styled(TableCell)({
    width: '15%'
})

const MemberCell = styled(TableCell)({
    textAlign: 'right',
    width: '40%',
})

const PerMemberCell = styled(TableCell)({
    width: "15%"
})

const DeleteCell = styled(TableCell)({
    width: "6%"
});

const StyledSelect = styled(Select)({
    padding: '2px',
    border: 'none',
    '& .MuiSelect-select': {
        padding: '0 24px 0 0', // Adjust padding as needed, keeping space for the icon
        minWidth: 'auto' // To make the Select as small as possible
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    }
})


interface ExpenseTableTitleProps {
    addExpense: () => void;
}

function ExpenseTableTitle(props: ExpenseTableTitleProps) {
    const { addExpense } = props;
    return (<div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginBottom: '16px' }}>
        <Typography sx={{ fontSize: 20, padding: '0px', margin: '0px' }} color="text.secondary" gutterBottom>
            Expenses
        </Typography>
        <div>
            <IconButton onClick={addExpense} sx={{ padding: '0px', margin: '0px' }}>
                <AddBoxIcon sx={{ fontSize: 20 }} />
            </IconButton>
        </div>
    </div>);
}

interface ExpenseTableHeadProps {
    theme: Theme,
    members: PersonInfo[],
    removeMemberAllChecked: (index: number, member: PersonInfo) => void;
    addMemberAllChecked: (memberId: any) => void;
    taxPercent: number,
    onTaxPercentChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    taxCheckedCnt: number;
    totalExpenses: number;
    onTaxCheckAllClick: () => void;
    deleteAllExpenses: () => void;
}

/**
 * Head for expense table
 * @param ExpenseTableHeadProps
 * @returns 
 */
function ExpenseTableHead(props: ExpenseTableHeadProps) {
    const {
        theme,
        taxPercent,
        onTaxPercentChange,
        taxCheckedCnt,
        totalExpenses,
        onTaxCheckAllClick,
        members,
        removeMemberAllChecked,
        addMemberAllChecked,
        deleteAllExpenses
    } = props;

    useEffect(() => {
        computeMembersAllCheckedCnt()
    }, [members]);

    const [membersAllCheckedCnt, setMembersAllCheckedCnt] = useState<number>(0);

    const computeMembersAllCheckedCnt = () => {
        const count = members.reduce((acc, member) => {
            return member.allChecked ? acc + 1 : acc;
        }, 0);
        setMembersAllCheckedCnt(count);
    }

    return (
        <TableHead sx={{ backgroundColor: theme.palette.secondary.main }}>
            <TableRow >
                {/* TAX HEAD CELL */}
                <TaxCell>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <TextField
                            label="Tax"
                            id="standard-size-small"
                            size="small"
                            type="number"
                            value={taxPercent}
                            onChange={onTaxPercentChange}
                            variant="standard"
                            style={{
                                width: '40%'
                            }}
                        />
                        <Checkbox
                            color="primary"
                            indeterminate={taxCheckedCnt > 0 && taxCheckedCnt < totalExpenses}
                            checked={taxCheckedCnt !== 0 && taxCheckedCnt === totalExpenses}
                            onChange={onTaxCheckAllClick}
                            inputProps={{
                                "aria-label": "select all has tax",
                            }}
                        />
                    </Box>
                </TaxCell>
                {/* AMOUNT HEAD CELL */}
                <AmountCell>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography style={{ marginRight: '8px' }}> Amount</Typography>
                        <TableSortLabel
                            direction={"asc"}
                            onClick={() => { return "asc"; }}
                        >
                        </TableSortLabel>
                    </Box>
                </AmountCell>
                {/* MEMBERS HEAD CELL */}
                <MemberCell>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography style={{ marginRight: '8px' }}> Members</Typography>
                            {
                                /* CHIPS COMPONENT */
                                members.map((member: PersonInfo, memberIndex: number) => {
                                    return (
                                        member.allChecked ? <Chip
                                            key={memberIndex}
                                            label={member.name}
                                            onDelete={() => {
                                                console.log(member)
                                                console.log(memberIndex)
                                                removeMemberAllChecked(memberIndex, member);
                                            }
                                            }
                                            style={{
                                                backgroundColor: member.color,
                                                margin: "2px",
                                            }}
                                        /> : null
                                    );
                                })
                            }
                        </Box>
                        {
                            /* SELECT COMPONENT */
                            membersAllCheckedCnt !== members.length ?
                                <StyledSelect
                                    multiple
                                    displayEmpty
                                    labelId="demo-select-small-label"
                                    value={[]}
                                    id="demo-select-small"
                                    onChange={(e: any) =>
                                        addMemberAllChecked(e.target.value[0])
                                    }
                                    renderValue={() => { return '' }}
                                    IconComponent={AddCircleIcon}
                                >
                                    {
                                        members
                                            .filter(member => !member.allChecked) // Implement this check based on your state structure
                                            .map(filteredMember => (
                                                <MenuItem key={filteredMember.id} value={filteredMember.id}>
                                                    {filteredMember.name}
                                                </MenuItem>
                                            ))
                                    }
                                </StyledSelect> : null
                        }
                    </Box>
                </MemberCell>
                {/* PER MEMBERS HEAD CELL */}
                <PerMemberCell>
                    <Typography style={{ marginRight: '8px' }}> Per Member </Typography>
                </PerMemberCell>
                {/* DELETE TABLE CELL */}
                <DeleteCell>
                    <IconButton>
                        <DeleteIcon sx={{ fontSize: 20 }} onClick={deleteAllExpenses} />
                    </IconButton>
                </DeleteCell>
            </TableRow>
        </TableHead >
    );
}

interface PersonInfo {
    id: number;
    name: string;
    amount: number;
    color: string;
    allChecked: boolean;
}

interface Expense {
    tax: boolean;
    amount: number;
    memberIds: number[];
}

export default function ExpenseTable(props: {
    theme: Theme;
    toggleTheme: any;
}) {
    const { theme, toggleTheme } = props;

    const [taxCheckedCnt, setTaxCheckedCnt] = useState<number>(0);
    const [taxPercent, setTaxPercent] = useState<number>(7);

    const lastInputRef = useRef(null); // Create a ref for the last input field
    const [settingLastInput, setSettingLastInput] = useState<number>(-1);

    const [membersAllCheckedCnt, setMembersAllCheckedCnt] = useState<number>(0);
    const [members, setMembers] = React.useState<PersonInfo[]>([
        { id: 0, name: "Ao Wang", amount: 0, color: Colors[0], allChecked: false },
        { id: 1, name: "Xiaoheng Xia", amount: 0, color: Colors[1], allChecked: false },
        { id: 2, name: "Hanyu Xu", amount: 0, color: Colors[2], allChecked: false },
    ]);

    const [expenses, setExpenses] = React.useState<Expense[]>([
        { tax: false, amount: 0, memberIds: [] },
        { tax: false, amount: 0, memberIds: [] },
        { tax: false, amount: 0, memberIds: [] },
    ]);

    useEffect(() => {
        console.log(expenses)
        calculateMemberTotals()
        if (settingLastInput > 0) {
            console.log("setting last input");
            (document.getElementById(`amount-${settingLastInput}`) as any).focus();
            setSettingLastInput(-1);
        }
    }, [expenses, settingLastInput]);

    /* Remove a member from all expenses */
    const removeMemberAllChecked = (index: number, member: PersonInfo) => {
        if (member.allChecked) {
            setMembersAllCheckedCnt(membersAllCheckedCnt - 1);
        }
        const newMembers = [...members];
        newMembers[index].allChecked = false;
        setMembers(newMembers);
        removeFromAllExpenseMemberList(member.id)

    }

    const removeFromAllExpenseMemberList = (memberId: number) => {
        const updatedExpenses: Expense[] = expenses.map((expense: Expense) => ({
            ...expense,
            memberIds: expense.memberIds.filter(id => id !== memberId)
        }));
        setExpenses(updatedExpenses);
    };

    const addMemberAllChecked = (memberId: any) => {
        console.log("memberId", memberId);
        if (!members[memberId].allChecked) {
            setMembersAllCheckedCnt(membersAllCheckedCnt + 1);
        }
        const newMembers = [...members];
        newMembers.forEach((member: PersonInfo) => {
            if (member.id === memberId) {
                member.allChecked = true;
            }
        });
        addToAllExpenseMemberList(memberId)
    }

    const addToAllExpenseMemberList = (memberId: number) => {
        const updatedExpenses: Expense[] = expenses.map((expense: Expense) => ({
            ...expense,
            memberIds: expense.memberIds.includes(memberId) ? expense.memberIds : [...expense.memberIds, memberId]
        }));
        setExpenses(updatedExpenses);
    };

    const onTaxPercentChange = (event: any) => {
        const inputValue = parseFloat(event.target.value)
        setTaxPercent(inputValue);
    };

    const onTaxCheck = (index: number) => {
        const updatedExpenses: any = [...expenses];
        let hasTax = updatedExpenses[index].tax;
        updatedExpenses[index].tax = !hasTax;
        // update tax checked count
        let newTaxCheckedCnt = hasTax ? taxCheckedCnt - 1 : taxCheckedCnt + 1;
        setTaxCheckedCnt(newTaxCheckedCnt);
        setExpenses(updatedExpenses);
    };

    const onTaxCheckAllClick = () => {
        if (taxCheckedCnt === expenses.length) {
            // unselect all
            setTaxCheckedCnt(0);
            const updatedExpenses = expenses.map((expense) => ({
                ...expense,
                tax: false,
            }));
            setExpenses(updatedExpenses);
            return;
        }
        // set tax checked count to equal to total expenses count
        setTaxCheckedCnt(expenses.length);
        const updatedExpenses = expenses.map((expense) => ({
            ...expense,
            tax: true,
        }));
        setExpenses(updatedExpenses);
    };

    const findMember = (memberId: number) => {
        return members.find((member) => member.id === memberId);
    }

    const addExpense = () => {
        setExpenses([...expenses, { tax: false, amount: 0, memberIds: [] }]);
    };

    const updateExpense = (index: number, field: keyof Expense, value: any) => {
        console.log("expense", value)
        const updatedExpenses: any = [...expenses];
        updatedExpenses[index][field] = value;
        setExpenses(updatedExpenses);
    };

    const removeExpenseMember = (index: number, memberId: number) => {
        const updatedExpenses: Expense[] = [...expenses];
        updatedExpenses[index].memberIds = updatedExpenses[index].memberIds.filter(
            (m: number) => m !== memberId
        );
        setExpenses(updatedExpenses);
        const member: any = findMember(memberId);
        if (member.allChecked) {
            member.allChecked = false;
            setMembersAllCheckedCnt(membersAllCheckedCnt - 1);
        }
    }

    // Function to calculate the total expense for each member including tax
    const calculateMemberTotals = () => {
        const memberTotals: { [key: number]: number } = {};
        expenses.forEach((expense) => {
            const taxMultiplier = expense.tax ? (taxPercent / 100) + 1 : 1;
            expense.memberIds.forEach((memberId) => {
                if (!memberTotals[memberId]) {
                    memberTotals[memberId] = 0;
                }
                memberTotals[memberId] += (expense.amount / expense.memberIds.length) * taxMultiplier;
            });
        });

        const updatedMembers = [...members]
        updatedMembers.forEach((member) => {
            if (memberTotals[member.id]) {
                member.amount = memberTotals[member.id];
            } else {
                member.amount = 0;
            }
        });
        setMembers(updatedMembers);
    };


    const calculateTotalExpense = (): number => {
        return expenses.reduce((total, expense) => {
            const taxMultiplier = expense.tax ? (taxPercent / 100) + 1 : 1;
            return total + (expense.amount * taxMultiplier);
        }, 0);
    };

    const calculateTotalUnassignedExpense = (): number => {
        return expenses.reduce((total, expense) => {
            const taxMultiplier = expense.tax ? (taxPercent / 100) + 1 : 1;
            if (expense.memberIds.length === 0) {
                return total + expense.amount * taxMultiplier;
            } else {
                return total;
            }
        }, 0);
    }

    const deleteExpense = (number: number) => {
        const expensesCopy = [
            ...expenses.slice(0, number),
            ...expenses.slice(number + 1)
        ];
        setExpenses(expensesCopy);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', padding: '16px' }}>
            <div style={{ width: '30%', }}>
                <Card sx={{ margin: 2, padding: '16px' }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                            Total Expenses
                        </Typography>
                        <Typography variant="h3" component="div" sx={{ marginBottom: '8px' }}>
                            ${formatTo2Decimal(calculateTotalExpense())}
                        </Typography>
                        {
                            calculateTotalUnassignedExpense() !== 0 ?
                                <Typography sx={{ fontSize: 16, marginBottom: '8px' }} color="error.main" gutterBottom>
                                    Unassigned Expenses:
                                    ${formatTo2Decimal(calculateTotalUnassignedExpense())}
                                </Typography> : null
                        }
                        {members.map((member, index) => {
                            return (
                                <Chip
                                    key={index}
                                    label={`${member?.name}: $${member.amount.toFixed(2)}`}
                                    style={{
                                        fontSize: '16px',
                                        backgroundColor: member.color,
                                        marginTop: "8px",
                                        marginBottom: "8px",
                                    }}
                                />
                            );
                        })
                        }
                    </CardContent>
                </Card>
            </div>
            <Card sx={{ margin: 2, width: "100%", mb: 2 }}>
                <TableContainer sx={{ padding: '32px' }}>
                    <ExpenseTableTitle addExpense={addExpense} />
                    <Table size="small">
                        <ExpenseTableHead
                            theme={theme}
                            taxPercent={taxPercent}
                            onTaxPercentChange={onTaxPercentChange}
                            taxCheckedCnt={taxCheckedCnt}
                            totalExpenses={expenses.length}
                            onTaxCheckAllClick={onTaxCheckAllClick}
                            members={members}
                            removeMemberAllChecked={removeMemberAllChecked}
                            addMemberAllChecked={addMemberAllChecked}
                            deleteAllExpenses={() => setExpenses([])}
                        />
                        <TableBody>
                            {expenses.map((expense, index) => (
                                <TableRow key={index}>
                                    <TaxCell>
                                        <Checkbox
                                            checked={expenses[index]["tax"]}
                                            onChange={() => onTaxCheck(index)}
                                        />
                                    </TaxCell>
                                    <AmountCell>
                                        <TextField
                                            hiddenLabel
                                            id={`amount-${index}`}
                                            defaultValue="Small"
                                            variant="filled"
                                            size="small"
                                            type="number"
                                            value={expense.amount}
                                            ref={index === expenses.length - 1 ? lastInputRef : null}
                                            onChange={(e) =>
                                                updateExpense(
                                                    index,
                                                    "amount",
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    // Find the next index
                                                    const nextIndex = index + 1;
                                                    console.log("nextIndex", nextIndex);
                                                    console.log("expense length", expenses.length);
                                                    if (nextIndex < expenses.length) {
                                                        // Focus the next TextField
                                                        (document.getElementById(`amount-${nextIndex}`) as any).focus();
                                                    } else {
                                                        setSettingLastInput(nextIndex);
                                                        addExpense();
                                                    }
                                                }
                                            }}
                                            onFocus={(e) => {
                                                // If the value is 0, clear the field when it gains focus
                                                if (e.target.value === '0') {
                                                    updateExpense(index, "amount", '');
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if (e.target.value === '') {
                                                    updateExpense(index, "amount", 0); // Reset to 0 when input is not focused and empty
                                                }
                                            }}
                                        />
                                    </AmountCell>
                                    <MemberCell>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <div>
                                                {expense.memberIds.map((memberId, memberIndex) => {
                                                    const member: any = members.find(
                                                        (person) => person.id === memberId
                                                    );
                                                    return (
                                                        <Chip
                                                            key={memberIndex}
                                                            label={member.name}
                                                            onDelete={() => {
                                                                removeExpenseMember(index, memberId);
                                                            }
                                                            }
                                                            style={{
                                                                backgroundColor: member.color,
                                                                margin: "2px",
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            {members.length !== expense.memberIds.length ?
                                                <StyledSelect
                                                    multiple
                                                    displayEmpty
                                                    labelId="demo-select-small-label"
                                                    value={expense.memberIds}
                                                    id="demo-select-small"
                                                    onChange={(e) =>
                                                        updateExpense(index, "memberIds", e.target.value)
                                                    }
                                                    renderValue={() => { return '' }}
                                                    IconComponent={AddCircleIcon}
                                                >
                                                    {members.map((member) =>
                                                        !expense.memberIds.includes(member.id) ? (
                                                            <MenuItem key={member.id} value={member.id}>
                                                                {member.name}
                                                            </MenuItem>
                                                        ) : null // Return null if the condition is not met
                                                    )}
                                                </StyledSelect> : null
                                            }
                                        </Box>
                                    </MemberCell>
                                    <PerMemberCell style={{ width: "14%" }}>
                                        {expense.memberIds.length > 0
                                            ? ((expense.amount / expense.memberIds.length) *
                                                (expense.tax ? (taxPercent / 100) + 1 : 1)).toFixed(2)
                                            : "0.00"}
                                    </PerMemberCell>
                                    <DeleteCell>
                                        <IconButton>
                                            <DeleteIcon sx={{ fontSize: 20 }} onClick={() => { deleteExpense(index) }} />
                                        </IconButton>
                                    </DeleteCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </div >
    );
}
